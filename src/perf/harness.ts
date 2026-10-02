import { Core, GameObjects, type Game } from "phaser";
import type BiomeScene from "@scenes/biomes/BiomeScene";
import type Enemy from "@entities/Enemy/Enemy";
import type Spell from "@entities/Spells/Spell";
import { isFootprintSpawnable } from "@helpers/walkability";
import type { EnemyType } from "@/types/game";
import type { GameSceneLike } from "@/types/scene";
import { installSeededRandom } from "./rng";
import { maxCounts, summarizeFrames } from "./frameStats";
import { nearestIndex, ringPlacements, type Point } from "./placement";
import type { PerfApi, PerfCounts, PerfResult, PerfScenarioOptions } from "./types";

// Perf harness (#526). Only ever loaded by a `VITE_PERF=1` build: PhaserGame
// imports it behind that compile-time flag, so production bundles carry none
// of this. It drives the live BiomeScene through its own seams (spawnEnemy,
// the spawn director, enemy taps and spell presses) rather than reimplementing
// gameplay, so what it measures is the real game.

// Inside the default enemy aggro radius (250), so every enemy engages.
const RING = { min: 90, max: 230 };
// How often the combat driver re-targets and presses abilities.
const DRIVER_INTERVAL_MS = 250;

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
    // AssignSpell's constructor returns the concrete Spell it builds.
    for (const spell of player.spells as unknown as Spell[]) {
        if (spell.targetKind === "ground" || !spell.checkReady()) continue;
        spell.press();
        break;
    }
}

async function run(game: Game, options: PerfScenarioOptions): Promise<PerfResult> {
    const scene = biomeScene(game);
    if (!scene) throw Error("perf: BiomeScene is not running");

    const restoreRandom = installSeededRandom(options.seed);

    // Hand population control to the harness: no trickle spawns, no despawns,
    // and nothing the director placed before the run started.
    scene["director"].stop();
    scene.removeSpawnTimer();
    liveEnemies(scene).forEach((enemy) => enemy.despawn());

    // Invincible player: top health back up after every hit (registered after
    // the player's own `enemy:attack` handler, so it runs second). The bar and
    // hit path still do their normal work.
    const heal = () => {
        const health = scene.player.health;
        if (scene.player.alive) health.setValue(health.stats.max);
    };
    scene.events.on("enemy:attack", heal);

    // Hold the count in combat: every kill is replaced near the player.
    const replace = () => spawnAround(scene, 1);
    const combat = options.scenario === "combat";
    if (combat) scene.events.on("enemy:dead", replace);

    spawnAround(scene, options.enemies);

    const driver = combat
        ? scene.time.addEvent({
              delay: DRIVER_INTERVAL_MS,
              loop: true,
              callback: () => drive(scene),
          })
        : null;

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

    await new Promise<void>((resolve) => {
        const begin = performance.now();
        let last = begin;
        let last_count = begin;
        const tick = (now: number) => {
            const elapsed = now - begin;
            if (elapsed >= options.warmupMs) {
                if (!sampling) {
                    sampling = true;
                    heap_start = heapMB();
                } else {
                    frames.push(now - last);
                }
                if (now - last_count >= 1000) {
                    last_count = now;
                    counts_end = countObjects(scene);
                    counts_max = maxCounts(counts_max, counts_end);
                }
            }
            last = now;
            if (elapsed >= options.warmupMs + options.sampleMs) {
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
    driver?.remove();
    scene.events.off("enemy:attack", heal);
    scene.events.off("enemy:dead", replace);
    restoreRandom();

    return {
        scenario: options.scenario,
        enemies: options.enemies,
        seed: options.seed,
        sampleMs: options.sampleMs,
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
    };
    window.__perf = api;
}
