import { Core, GameObjects, Scenes, type Game } from "phaser";
import type BiomeScene from "@scenes/biomes/BiomeScene";
import type Enemy from "@entities/Enemy/Enemy";
import Coin from "@entities/Loot/Coin";
import Crafting from "@entities/Loot/Crafting";
import Gem from "@entities/Loot/Gem";
import Special from "@entities/Loot/Special";
import { isFootprintSpawnable } from "@helpers/walkability";
import type { EnemyType } from "@/types/game";
import type { GameSceneLike } from "@/types/scene";
import { installSeededRandom } from "./rng";
import { installVirtualDateNow } from "./virtualClock";
import { digest } from "./digest";
import { parseDeviceRun, startDeviceRun } from "./deviceRun";
import { maxCounts, summarizeFrames } from "./frameStats";
import { nearestIndex, ringPlacements, type Point } from "./placement";
import type {
    PerfAggregates,
    PerfApi,
    PerfCounts,
    PerfPrepareOptions,
    PerfResult,
    PerfScenarioOptions,
    ReplayCheckpoint,
} from "./types";

// Perf harness (#526, #527). Only ever loaded by a `VITE_PERF=1` build:
// PhaserGame imports it behind that compile-time flag, so production bundles
// carry none of this. It drives the live BiomeScene through its own seams
// (spawnEnemy, the spawn director, enemy taps and spell presses) rather than
// reimplementing gameplay, so what it measures is the real game.
//
// Determinism: a run seeds Math.random, takes the game loop over so every
// step is exactly STEP_MS (with a virtual Date.now for the tween clock), and
// restarts the biome scene under that regime, so every timer starts in phase.
// The same options then yield the same world tick for tick.

// Inside the default enemy aggro radius (250), so every enemy engages.
const RING = { min: 90, max: 230 };
// How often the combat driver re-targets and presses abilities.
const DRIVER_INTERVAL_MS = 250;
// Every perf run (#527) advances the game by exactly this much per step, so
// timers, tweens, physics and animation see the same deltas on every run.
const STEP_MS = 1000 / 60;
// Ticks allowed for the scene restart to reach create().
const RESTART_TICKS = 600;

// Clock keeps its events in private arrays and has no public count; read them
// for the timer gauge only. Phaser 4.2 `Time.Clock` internals.
interface ClockInternals {
    _active?: unknown[];
    _pendingInsertion?: unknown[];
}

interface MemoryPerformance extends Performance {
    memory?: { usedJSHeapSize: number };
}

function heapMB(): number | null {
    const memory = (performance as MemoryPerformance).memory;
    return memory ? Math.round((memory.usedJSHeapSize / 1048576) * 10) / 10 : null;
}

function biomeScene(game: Game): BiomeScene | null {
    if (!game.scene.isActive("BiomeScene")) return null;
    const scene = game.scene.getScene("BiomeScene") as BiomeScene;
    return scene.player && scene.enemies ? scene : null;
}

function liveEnemies(scene: BiomeScene): Enemy[] {
    return (scene.enemies.getChildren() as Enemy[]).filter((enemy) => enemy.alive);
}

export function countObjects(scene: BiomeScene): PerfCounts {
    let gameObjects = 0;
    let graphics = 0;
    let texts = 0;
    const walk = (list: GameObjects.GameObject[]) => {
        list.forEach((child) => {
            gameObjects++;
            if (child instanceof GameObjects.Graphics) graphics++;
            if (child instanceof GameObjects.Text) texts++;
            if (child instanceof GameObjects.Container) walk(child.list);
        });
    };
    walk(scene.children.list);

    const clock = scene.time as unknown as ClockInternals;
    return {
        enemies: liveEnemies(scene).length,
        bodies: scene.physics.world.bodies.size,
        timers: (clock._active?.length ?? 0) + (clock._pendingInsertion?.length ?? 0),
        tweens: scene.tweens.getTweens().length,
        displayList: scene.children.list.length,
        gameObjects,
        graphics,
        texts,
    };
}

function spawnAround(scene: BiomeScene, count: number): void {
    if (count <= 0) return;
    // Every creature in a pool shares the regular footprint closely enough for
    // placement; size the ring by the first pick.
    const ids: EnemyType[] = Array.from({ length: count }, () => scene["pickFromPool"]());
    const size = scene["enemyFootprint"](ids[0], false);
    const grid = scene["spawn_grid"];
    const points = ringPlacements({
        centre: { x: scene.player.x, y: scene.player.y },
        count,
        minRadius: RING.min,
        maxRadius: RING.max,
        size,
        random: Math.random,
        accept: (rect) => isFootprintSpawnable(grid, rect),
    });
    points.forEach((point, i) => scene.spawnEnemy(ids[i], point));
}

// Taps the nearest live enemy (the real select path) if nothing live is
// selected, then presses every ready ability that does not need a ground tap.
function drive(scene: BiomeScene): void {
    const player = scene.player;
    if (!player.alive) return;

    if (!(scene as unknown as GameSceneLike).selected?.alive) {
        const enemies = liveEnemies(scene);
        const points: Point[] = enemies.map((enemy) => ({ x: enemy.x, y: enemy.y }));
        const index = nearestIndex(player, points);
        if (index >= 0) enemies[index].emit("pointerdown");
    }

    if (player.casting.getState() !== "idle") return;
    for (const spell of player.spells) {
        if (spell.targetKind === "ground" || !spell.checkReady()) continue;
        spell.press();
        break;
    }
}

interface Session {
    scene: BiomeScene;
    tick: number;
    aggregates: PerfAggregates;
    // One fixed step; `render` draws it, otherwise the step runs headless.
    step(render: boolean): void;
    // Hands the frame loop back to the browser, still at the fixed step.
    wakeFixed(): void;
    finish(): void;
}

let session: Session | null = null;

function lootOf(scene: BiomeScene): { key: string; x: number; y: number }[] {
    const loot: { key: string; x: number; y: number }[] = [];
    scene.children.list.forEach((child) => {
        if (
            child instanceof Coin ||
            child instanceof Gem ||
            child instanceof Crafting ||
            child instanceof Special
        ) {
            loot.push({ key: child.texture.key, x: child.x, y: child.y });
        }
    });
    return loot;
}

function checkpoint(current: Session): ReplayCheckpoint {
    const { scene } = current;
    const enemies = (scene.enemies.getChildren() as Enemy[]).map((enemy) => ({
        key: enemy.key,
        x: enemy.x,
        y: enemy.y,
        health: enemy.health.getValue(),
        state: `${enemy.state}/${enemy.states.movement}/${enemy.states.attack}`,
    }));
    const hash = digest({
        player: {
            x: scene.player.x,
            y: scene.player.y,
            health: scene.player.health.getValue(),
            alive: scene.player.alive,
        },
        enemies,
        loot: lootOf(scene),
    });
    return { tick: current.tick, hash, aggregates: { ...current.aggregates } };
}

function prepare(game: Game, options: PerfPrepareOptions): Session {
    session?.finish();
    const running = biomeScene(game);
    if (!running) throw Error("perf: BiomeScene is not running");
    const scene = running;

    const restoreRandom = installSeededRandom(options.seed);
    const clock = installVirtualDateNow(Date.now());
    const original_callback = game.loop.callback;
    let time = game.loop.now;
    const advance = () => {
        time += STEP_MS;
        clock.advance(STEP_MS);
    };

    let done = false;
    let driver: Phaser.Time.TimerEvent | null = null;
    const combat = options.scenario === "combat";

    // Invincible player: top health back up after every hit (registered after
    // the player's own `enemy:attack` handler, so it runs second). The bar and
    // hit path still do their normal work.
    const onAttack = (damage: number) => {
        current.aggregates.attacks++;
        current.aggregates.damageTaken += damage;
        const health = scene.player.health;
        if (scene.player.alive) health.setValue(health.stats.max);
    };
    // In combat every kill is replaced near the player, so the count holds.
    const onDead = () => {
        current.aggregates.kills++;
        if (combat) spawnAround(scene, 1);
    };

    const current: Session = {
        scene,
        tick: 0,
        aggregates: { kills: 0, damageTaken: 0, attacks: 0 },
        step: (render) => {
            advance();
            if (render) game.step(time, STEP_MS);
            else game.headlessStep(time, STEP_MS);
        },
        wakeFixed: () => {
            game.loop.callback = () => {
                advance();
                game.step(time, STEP_MS);
            };
            game.loop.wake();
        },
        finish: () => {
            if (done) return;
            done = true;
            if (session === current) session = null;
            scene.events.off("enemy:attack", onAttack);
            scene.events.off("enemy:dead", onDead);
            driver?.remove();
            game.loop.sleep();
            game.loop.callback = original_callback;
            clock.restore();
            restoreRandom();
            game.loop.wake();
        },
    };

    game.loop.sleep();

    // Restart under the seed and the fixed step: create() and everything it
    // schedules (regen ticks, cooldowns, the spawn timer) start in phase.
    let created = false;
    scene.events.once(Scenes.Events.CREATE, () => {
        created = true;
    });
    scene.scene.restart(scene["config"]);
    for (let i = 0; i < RESTART_TICKS && !created; i++) current.step(false);
    if (!created) {
        current.finish();
        throw Error("perf: BiomeScene restart did not reach create()");
    }

    // Hand population control to the harness: no trickle spawns, no despawns.
    scene["director"].stop();
    scene.removeSpawnTimer();
    liveEnemies(scene).forEach((enemy) => enemy.despawn());

    scene.events.on("enemy:attack", onAttack);
    scene.events.on("enemy:dead", onDead);
    spawnAround(scene, options.enemies);
    if (combat) {
        driver = scene.time.addEvent({
            delay: DRIVER_INTERVAL_MS,
            loop: true,
            callback: () => drive(scene),
        });
    }

    session = current;
    return current;
}

function advanceReplay(ticks: number): ReplayCheckpoint {
    if (!session) throw Error("perf: advance() before prepare()");
    for (let i = 0; i < ticks; i++) {
        session.step(i === ticks - 1);
        session.tick++;
    }
    return checkpoint(session);
}

async function run(game: Game, options: PerfScenarioOptions): Promise<PerfResult> {
    const current = prepare(game, options);
    const { scene } = current;

    // Work time: Phaser's step (scene updates, physics) through render.
    const work: number[] = [];
    let step_start = 0;
    let sampling = false;
    const onPreStep = () => {
        step_start = performance.now();
    };
    const onPostRender = () => {
        if (sampling) work.push(performance.now() - step_start);
    };
    game.events.on(Core.Events.PRE_STEP, onPreStep);
    game.events.on(Core.Events.POST_RENDER, onPostRender);

    const frames: number[] = [];
    let counts_end = countObjects(scene);
    let counts_max = counts_end;
    let heap_start: number | null = null;

    current.wakeFixed();
    await new Promise<void>((resolve) => {
        let frame = 0;
        let last = 0;
        const tick = (now: number) => {
            frame++;
            if (frame > options.warmupFrames) {
                if (!sampling) {
                    sampling = true;
                    heap_start = heapMB();
                } else {
                    frames.push(now - last);
                }
                if (frame % 60 === 0) {
                    counts_end = countObjects(scene);
                    counts_max = maxCounts(counts_max, counts_end);
                }
            }
            last = now;
            if (frame >= options.warmupFrames + options.sampleFrames) {
                resolve();
                return;
            }
            requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    });

    counts_end = countObjects(scene);
    counts_max = maxCounts(counts_max, counts_end);
    const heap_end = heapMB();

    game.events.off(Core.Events.PRE_STEP, onPreStep);
    game.events.off(Core.Events.POST_RENDER, onPostRender);
    current.finish();

    return {
        scenario: options.scenario,
        enemies: options.enemies,
        seed: options.seed,
        sampleFrames: options.sampleFrames,
        frame: summarizeFrames(frames),
        work: summarizeFrames(work),
        counts: { end: counts_end, max: counts_max },
        heapMB:
            heap_start !== null && heap_end !== null ? { start: heap_start, end: heap_end } : null,
    };
}

export function installPerfHarness(game: Game): void {
    const api: PerfApi = {
        ready: () => biomeScene(game) !== null,
        run: (options) => run(game, options),
        prepare: (options) => {
            prepare(game, options);
        },
        advance: (ticks) => advanceReplay(ticks),
        finish: () => session?.finish(),
    };
    window.__perf = api;

    const device = parseDeviceRun(window.location.search);
    if (device) startDeviceRun(game, api, device);
}
