import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Events } from "phaser";
import BiomeScene from "./BiomeScene";
import type { SpawnHost } from "./SpawnDirector";
import type { WalkabilityGrid } from "@helpers/walkability";
import { AREA_KILLS_TO_BOSS, SPAWN_INTERVAL_MS } from "@config/area";
import { BOSS_SCALE } from "@entities/Enemy/Boss";
import { ROAR_EDGE_MARGIN } from "@entities/UI/BossRoar";
import { DEFAULT_SETTINGS, writeSettings } from "@services/settingsStorage";
import { BIOMES, BIOME_IDS, DEFAULT_BIOME, resolveBiome } from "./biomes";
import { OverlayWindows, type Bounds, type ViewRect } from "./propOverlayWindows";
import store from "@store";

// The area loop: a SpawnDirector (tested on its own in SpawnDirector.test.ts)
// populates the area, counts kills and brings on the boss. These tests cover
// the scene's side of it: wiring the director to the clock, the death events,
// game over and shutdown, and the host adapter it reads the world through.
//
// These methods only touch scene fields, the clock and the event emitter, so we
// run them against a minimal fake scene built on the real prototype — mocking at
// the entity seam rather than booting Phaser (the Phase 2 convention).

interface FakeTimer {
    remove: ReturnType<typeof vi.fn>;
}

interface FakeDirector {
    start: ReturnType<typeof vi.fn>;
    stop: ReturnType<typeof vi.fn>;
    tick: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    onEnemyDead: ReturnType<typeof vi.fn>;
}

interface SceneUnderTest {
    time: { delayedCall: ReturnType<typeof vi.fn>; addEvent: ReturnType<typeof vi.fn> };
    area_cleared_timer?: FakeTimer;
    spawn_timer?: FakeTimer;
    area_cleared_ui: { setVisible: ReturnType<typeof vi.fn> };
    enemy_pool: string[];
    area_cleared: boolean;
    game_over: boolean;
    director: FakeDirector;
    biome: (typeof BIOMES)[keyof typeof BIOMES];
    config: { type?: string; biome?: string };
    init(config: { type?: string; biome?: string }): void;
    startArea(): void;
    onEnemyDead(enemy: object): void;
    announceBoss(boss: { x: number; y: number }): void;
    areaCleared(): void;
    removeAreaClearedTimer(): void;
    gameOver(): void;
    shutdown(): void;
    travel_subscription?: ReturnType<typeof vi.fn>;
    spawnEnemy: ReturnType<typeof vi.fn>;
    spawnBoss: ReturnType<typeof vi.fn>;
    spawnHost(): SpawnHost<never, string>;
    textures: { getFrame: ReturnType<typeof vi.fn> };
    spawn_grid: WalkabilityGrid;
    physics: {
        pause: ReturnType<typeof vi.fn>;
        world: {
            removeCollider: ReturnType<typeof vi.fn>;
            bounds?: { left: number; top: number; right: number; bottom: number };
        };
        add?: { collider: ReturnType<typeof vi.fn> };
    };
    map_colliders: object[];
    collision_layers: object[];
    prop_overlays: Array<{ destroy: ReturnType<typeof vi.fn> }>;
    prop_layers: object[];
    overlay_windows: OverlayWindows<{ x: number; y: number }>;
    overlay_seen: Set<number>;
    overlay_bounds: Bounds;
    overlay_view: ViewRect;
    overlay_point: { x: number; y: number };
    setupMapCollisions(): void;
    updatePropOverlays(): void;
    sortCharactersByFeet(): void;
    add: { sprite: ReturnType<typeof vi.fn> };
    map: { tileWidth: number; tileHeight: number; width?: number; height?: number };
    scale: { width: number; height: number };
    enemies: {
        runChildUpdate: boolean;
        getChildren: ReturnType<typeof vi.fn>;
        children?: Set<object>;
        name?: string;
    };
    UI: { cleanup: ReturnType<typeof vi.fn> };
    player: {
        cleanup: ReturnType<typeof vi.fn>;
        alive: boolean;
        x: number;
        y: number;
        body?: { velocity: { x: number; y: number } };
        height?: number;
        setDepth?: ReturnType<typeof vi.fn>;
    };
    input: { off: ReturnType<typeof vi.fn>; activePointer: object };
    cursors: { esc: { isDown: boolean } };
    events: {
        on: ReturnType<typeof vi.fn>;
        off: ReturnType<typeof vi.fn>;
        once: ReturnType<typeof vi.fn>;
        emit: ReturnType<typeof vi.fn>;
    };
}

function makeScene(overrides: Partial<SceneUnderTest> = {}): {
    scene: SceneUnderTest;
    pending: FakeTimer;
    spawnTimer: FakeTimer;
} {
    const pending: FakeTimer = { remove: vi.fn() };
    const spawnTimer: FakeTimer = { remove: vi.fn() };
    const scene = Object.create(BiomeScene.prototype) as SceneUnderTest;
    scene.time = { delayedCall: vi.fn(() => pending), addEvent: vi.fn(() => spawnTimer) };
    scene.area_cleared_ui = { setVisible: vi.fn() };
    scene.enemy_pool = ["baby-ghoul", "ghoul"];
    scene.area_cleared = false;
    scene.game_over = false;
    scene.director = {
        start: vi.fn(),
        stop: vi.fn(),
        tick: vi.fn(),
        update: vi.fn(),
        onEnemyDead: vi.fn(),
    };
    scene.biome = BIOMES[DEFAULT_BIOME];
    scene.physics = { pause: vi.fn(), world: { removeCollider: vi.fn() } };
    // Object.create() skips field initialisers, so the tilemap collision state
    // the scene sets up in create() has to be seeded here.
    scene.map_colliders = [];
    scene.collision_layers = [];
    scene.prop_overlays = [];
    scene.prop_layers = [];
    scene.overlay_windows = new OverlayWindows();
    scene.overlay_seen = new Set();
    scene.overlay_bounds = { left: 0, top: 0, right: 0, bottom: 0 };
    scene.overlay_view = { x: 0, y: 0, width: 0, height: 0 };
    scene.overlay_point = { x: 0, y: 0 };
    scene.add = { sprite: vi.fn() };
    scene.enemies = { runChildUpdate: true, getChildren: vi.fn(() => []) };
    scene.UI = { cleanup: vi.fn() };
    scene.player = { cleanup: vi.fn(), alive: false, x: 0, y: 0 };
    scene.input = { off: vi.fn(), activePointer: {} };
    scene.cursors = { esc: { isDown: false } };
    scene.events = { on: vi.fn(), off: vi.fn(), once: vi.fn(), emit: vi.fn() };
    scene.spawnEnemy = vi.fn();
    scene.spawnBoss = vi.fn();
    Object.assign(scene, overrides);
    return { scene, pending, spawnTimer };
}

beforeEach(() => {
    vi.spyOn(store, "dispatch").mockImplementation((action) => action);
});

afterEach(() => {
    vi.restoreAllMocks();
    // Some tests persist Debug spawn overrides; never let them leak onward.
    localStorage.clear();
});

describe("BiomeScene.startArea", () => {
    it("registers the death listener exactly once across re-entry", () => {
        const { scene } = makeScene();

        scene.startArea();

        expect(scene.events.off).toHaveBeenCalledWith("enemy:dead", scene.onEnemyDead, scene);
        expect(scene.events.on).toHaveBeenCalledWith("enemy:dead", scene.onEnemyDead, scene);
    });

    it("resets the HUD: the full kill count, and a stale boss flag cleared", () => {
        const { scene } = makeScene();

        scene.startArea();

        expect(store.dispatch).toHaveBeenCalledWith({
            type: "SET_ENEMIES_REMAINING",
            payload: { value: AREA_KILLS_TO_BOSS },
        });
        expect(store.dispatch).toHaveBeenCalledWith({
            type: "SET_BOSS_ACTIVE",
            payload: { value: false },
        });
    });

    it("applies the spawn overrides on area entry, Debug mode off", () => {
        writeSettings({ ...DEFAULT_SETTINGS, godMode: true, debug: false, killsToBossOverride: 3 });
        const { scene } = makeScene();

        scene.startArea();

        expect(store.dispatch).toHaveBeenCalledWith({
            type: "SET_ENEMIES_REMAINING",
            payload: { value: 3 },
        });
    });

    it("builds the spawn debug overlay only when Debug and its toggle are both on", () => {
        const graphics = { setDepth: vi.fn(() => graphics), destroy: vi.fn() };
        const withAdd = () => {
            const { scene } = makeScene();
            (scene as unknown as { add: object }).add = {
                sprite: vi.fn(),
                graphics: vi.fn(() => graphics),
            };
            return scene as SceneUnderTest & {
                add: { graphics: ReturnType<typeof vi.fn> };
                spawn_overlay?: object;
            };
        };

        writeSettings({
            ...DEFAULT_SETTINGS,
            godMode: true,
            debug: true,
            spawnDebugOverlay: false,
        });
        const off = withAdd();
        off.startArea();
        expect(off.spawn_overlay).toBeUndefined();

        writeSettings({
            ...DEFAULT_SETTINGS,
            godMode: true,
            debug: false,
            spawnDebugOverlay: true,
        });
        const debugOff = withAdd();
        debugOff.startArea();
        expect(debugOff.spawn_overlay).toBeUndefined();

        writeSettings({ ...DEFAULT_SETTINGS, godMode: true, debug: true, spawnDebugOverlay: true });
        const on = withAdd();
        on.startArea();
        expect(on.spawn_overlay).toBeDefined();
        expect(on.add.graphics).toHaveBeenCalledTimes(1);

        // Re-entry replaces it, releasing the old one.
        on.startArea();
        expect(graphics.destroy).toHaveBeenCalledTimes(1);
    });

    it("ticks a fresh director on a looping, pause-aware scene timer", () => {
        const { scene, spawnTimer } = makeScene();
        const stale = scene.director;

        scene.startArea();

        expect(scene.director).not.toBe(stale);
        expect(scene.time.addEvent).toHaveBeenCalledTimes(1);
        const config = scene.time.addEvent.mock.calls[0][0];
        expect(config).toMatchObject({ delay: SPAWN_INTERVAL_MS, loop: true });
        expect(scene.spawn_timer).toBe(spawnTimer);
    });

    it("replaces rather than stacks the spawn timer on re-entry", () => {
        const { scene } = makeScene();
        scene.startArea();
        const first = scene.spawn_timer!;

        scene.startArea();

        expect(first.remove).toHaveBeenCalledWith(false);
    });
});

describe("BiomeScene.announceBoss", () => {
    it("listens for boss:spawned once per area entry", () => {
        const { scene } = makeScene();

        scene.startArea();

        expect(scene.events.off).toHaveBeenCalledWith("boss:spawned", scene.announceBoss, scene);
        expect(scene.events.on).toHaveBeenCalledWith("boss:spawned", scene.announceBoss, scene);
    });

    it("puts ROAR! at the screen edge towards an off-screen boss", () => {
        const { scene } = makeScene();
        const text = {
            width: 120,
            height: 50,
            setPosition: vi.fn(() => text),
            once: vi.fn(),
            off: vi.fn(),
            destroy: vi.fn(),
            setOrigin: vi.fn(() => text),
            setScrollFactor: vi.fn(() => text),
            setDepth: vi.fn(() => text),
            setAlpha: vi.fn(() => text),
        };
        const addText = vi.fn(() => text);
        Object.assign(scene, {
            add: { sprite: vi.fn(), bitmapText: addText },
            tweens: { chain: vi.fn(() => ({ stop: vi.fn() })) },
            scale: { width: 800, height: 600 },
            cameras: { main: { zoom: 1, worldView: { x: 4600, y: 4700 } } },
        });
        scene.player = { ...scene.player, x: 5000, y: 5000 };

        // Due right of the player, well off the 800px-wide screen.
        scene.announceBoss({ x: 6000, y: 5000 });

        // Screen: player centred at (400, 300), boss due right; the word is
        // inset from the right edge by half its 120px width plus the margin.
        expect(text.setPosition).toHaveBeenCalledWith(800 - 60 - ROAR_EDGE_MARGIN, 300);
    });

    it("stops listening on shutdown", () => {
        const { scene } = makeScene();

        scene.shutdown();

        expect(scene.events.off).toHaveBeenCalledWith("boss:spawned", scene.announceBoss, scene);
    });
});

describe("BiomeScene.onEnemyDead", () => {
    it("receives the dying enemy itself through the real enemy:dead event", () => {
        // Enemy.death() emits `enemy:dead` with `this`; the director counts a
        // kill only for an enemy it tracks, so the instance must arrive intact.
        const { scene } = makeScene();
        (scene as unknown as { events: Events.EventEmitter }).events = new Events.EventEmitter();
        scene.player = { ...scene.player, body: { velocity: { x: 0, y: 0 } } };
        scene.startArea();
        const onEnemyDead = vi.spyOn(scene.director, "onEnemyDead");
        const enemy = { x: 0, y: 0, despawn: vi.fn() };

        (scene.events as unknown as Events.EventEmitter).emit("enemy:dead", enemy);

        expect(onEnemyDead).toHaveBeenCalledTimes(1);
        expect(onEnemyDead.mock.calls[0][0]).toBe(enemy);
    });

    it("hands the death to the director", () => {
        const { scene } = makeScene();
        const enemy = {};

        scene.onEnemyDead(enemy);

        expect(scene.director.onEnemyDead).toHaveBeenCalledWith(enemy);
    });

    it("ignores deaths once the game is over", () => {
        const { scene } = makeScene({ game_over: true });

        scene.onEnemyDead({});

        expect(scene.director.onEnemyDead).not.toHaveBeenCalled();
    });
});

describe("BiomeScene.spawnHost", () => {
    it("only ever picks creatures belonging to the active biome", () => {
        BIOME_IDS.forEach((id) => {
            const { scene } = makeScene({ enemy_pool: BIOMES[id].enemies });
            const host = scene.spawnHost();

            for (let i = 0; i < 20; i++) {
                expect(BIOMES[id].enemies).toContain(host.pickRegular());
                expect(BIOMES[id].enemies).toContain(host.pickBoss());
            }
        });
    });

    it("sizes a creature by its sprite's default frame, and a boss at boss scale", () => {
        const { scene } = makeScene();
        scene.textures = { getFrame: vi.fn(() => ({ width: 20, height: 24 })) };
        const host = scene.spawnHost();

        expect(host.footprint("imp", false)).toEqual({ width: 20, height: 24 });
        expect(host.footprint("imp", true)).toEqual({
            width: 20 * BOSS_SCALE,
            height: 24 * BOSS_SCALE,
        });
        expect(scene.textures.getFrame).toHaveBeenCalledWith("imp");
    });

    it("checks spawn footprints against the area's spawn grid", () => {
        const { scene } = makeScene();
        // One spawnable 10px tile.
        scene.spawn_grid = {
            width: 1,
            height: 1,
            tileWidth: 10,
            tileHeight: 10,
            spawnable: new Uint8Array([1]),
        };
        const host = scene.spawnHost();

        expect(host.isSpawnable({ x: 1, y: 1, width: 8, height: 8 })).toBe(true);
        expect(host.isSpawnable({ x: 5, y: 5, width: 8, height: 8 })).toBe(false);
    });

    it("reads the player's velocity, treating a missing body as standing still", () => {
        const { scene } = makeScene();
        scene.player = { ...scene.player, body: { velocity: { x: 3, y: -4 } } };
        expect(scene.spawnHost().playerVelocity()).toEqual({ x: 3, y: -4 });

        scene.player = { ...scene.player, body: undefined };
        expect(scene.spawnHost().playerVelocity()).toEqual({ x: 0, y: 0 });
    });

    it("announces each boss spawn as boss:spawned, with the boss", () => {
        const { scene } = makeScene();
        const boss = {} as never;

        scene.spawnHost().onBossSpawned(boss);

        expect(scene.events.emit).toHaveBeenCalledWith("boss:spawned", boss);
    });

    it("mirrors progress into the store for the HUD", () => {
        const { scene } = makeScene();

        scene.spawnHost().onProgress(7, true);

        expect(store.dispatch).toHaveBeenCalledWith({
            type: "SET_ENEMIES_REMAINING",
            payload: { value: 7 },
        });
        expect(store.dispatch).toHaveBeenCalledWith({
            type: "SET_BOSS_ACTIVE",
            payload: { value: true },
        });
    });
});

describe("BiomeScene.areaCleared", () => {
    it("shows the banner on the scene clock, not a raw setTimeout", () => {
        const setTimeoutSpy = vi.spyOn(globalThis, "setTimeout");
        const { scene } = makeScene();

        scene.areaCleared();

        expect(setTimeoutSpy).not.toHaveBeenCalled();
        expect(scene.time.delayedCall).toHaveBeenCalledTimes(1);
        expect(scene.time.delayedCall.mock.calls[0][0]).toBe(1500);
        setTimeoutSpy.mockRestore();
    });

    it("stores the timer so cleanup can cancel it", () => {
        const { scene, pending } = makeScene();

        scene.areaCleared();
        expect(scene.area_cleared_timer).toBe(pending);

        scene.removeAreaClearedTimer();
        expect(pending.remove).toHaveBeenCalledWith(false);
        expect(scene.area_cleared_timer).toBeUndefined();
    });

    it("is idempotent — a second call does not stack another banner timer", () => {
        const { scene } = makeScene();

        scene.areaCleared();
        scene.areaCleared();

        expect(scene.time.delayedCall).toHaveBeenCalledTimes(1);
    });
});

describe("BiomeScene.gameOver", () => {
    it("cancels the pending banner timer and stops the area", () => {
        const { scene, pending } = makeScene();
        scene.areaCleared();

        scene.gameOver();

        expect(pending.remove).toHaveBeenCalledWith(false);
        expect(scene.area_cleared_timer).toBeUndefined();
        expect(scene.physics.pause).toHaveBeenCalled();
        expect(scene.events.off).toHaveBeenCalledWith("enemy:dead", scene.onEnemyDead, scene);
    });

    it("stops the director and its spawn timer", () => {
        const { scene, spawnTimer } = makeScene();
        scene.spawn_timer = spawnTimer;

        scene.gameOver();

        expect(scene.director.stop).toHaveBeenCalled();
        expect(spawnTimer.remove).toHaveBeenCalledWith(false);
        expect(scene.spawn_timer).toBeUndefined();
    });
});

describe("BiomeScene.shutdown", () => {
    it("cancels the banner timer, drops the death listener and runs entity cleanup", () => {
        const { scene, pending } = makeScene();
        scene.areaCleared();

        scene.shutdown();

        expect(pending.remove).toHaveBeenCalledWith(false);
        expect(scene.area_cleared_timer).toBeUndefined();
        expect(scene.events.off).toHaveBeenCalledWith("enemy:dead", scene.onEnemyDead, scene);
        expect(scene.UI.cleanup).toHaveBeenCalled();
        expect(scene.player.cleanup).toHaveBeenCalled();
    });

    it("releases the travel-request store subscription", () => {
        const unsubscribe = vi.fn();
        const { scene } = makeScene({ travel_subscription: unsubscribe });

        scene.shutdown();

        expect(unsubscribe).toHaveBeenCalledTimes(1);
        expect(scene.travel_subscription).toBeUndefined();
    });

    it("is idempotent — a second shutdown does not call the subscription's unsubscribe again", () => {
        const unsubscribe = vi.fn();
        const { scene } = makeScene({ travel_subscription: unsubscribe });

        scene.shutdown();
        scene.shutdown();

        expect(unsubscribe).toHaveBeenCalledTimes(1);
    });

    it("does not throw when there is no travel subscription to release", () => {
        const { scene } = makeScene();

        expect(() => scene.shutdown()).not.toThrow();
    });

    it("releases the spawn debug overlay, once", () => {
        const { scene } = makeScene();
        const overlay = { cleanup: vi.fn() };
        (scene as unknown as { spawn_overlay?: object }).spawn_overlay = overlay;

        scene.shutdown();
        scene.shutdown();

        expect(overlay.cleanup).toHaveBeenCalledTimes(1);
    });

    it("removes the spawn timer, once", () => {
        const { scene, spawnTimer } = makeScene();
        scene.spawn_timer = spawnTimer;

        scene.shutdown();
        scene.shutdown();

        expect(spawnTimer.remove).toHaveBeenCalledTimes(1);
        expect(scene.spawn_timer).toBeUndefined();
    });

    it("removes every tilemap collider it registered", () => {
        const colliders = [{ id: "terrain" }, { id: "structure" }];
        const { scene } = makeScene({ map_colliders: colliders });

        scene.shutdown();

        expect(scene.physics.world.removeCollider).toHaveBeenCalledTimes(2);
        colliders.forEach((collider) =>
            expect(scene.physics.world.removeCollider).toHaveBeenCalledWith(collider)
        );
        expect(scene.map_colliders).toEqual([]);
    });

    it("removes the enemy-vs-enemy group collider, once", () => {
        const enemy_collider = { id: "enemies" };
        const { scene } = makeScene();
        (scene as unknown as { enemy_collider?: object }).enemy_collider = enemy_collider;

        scene.shutdown();
        scene.shutdown();

        expect(scene.physics.world.removeCollider).toHaveBeenCalledTimes(1);
        expect(scene.physics.world.removeCollider).toHaveBeenCalledWith(enemy_collider);
    });

    it("survives the Arcade world already being torn down", () => {
        // Phaser's physics plugin shuts its world down before the scene's own
        // SHUTDOWN handler runs, so `physics.world` is routinely null here. A
        // throw at this point would skip the rest of shutdown and leak the
        // travel subscription.
        const unsubscribe = vi.fn();
        const { scene } = makeScene({
            map_colliders: [{ id: "terrain" }],
            travel_subscription: unsubscribe,
        });
        (scene.physics as { world: unknown }).world = null;

        expect(() => scene.shutdown()).not.toThrow();
        expect(unsubscribe).toHaveBeenCalledTimes(1);
        expect(scene.map_colliders).toEqual([]);
    });

    it("destroys the prop overlay pool", () => {
        // Scene instances are reused across scene.start(), so a surviving pool
        // would point at sprites the previous visit's display list destroyed.
        const sprites = [{ destroy: vi.fn() }, { destroy: vi.fn() }];
        const { scene } = makeScene({ prop_overlays: sprites, prop_layers: [{ id: "props" }] });

        scene.shutdown();

        sprites.forEach((sprite) => expect(sprite.destroy).toHaveBeenCalledTimes(1));
        expect(scene.prop_overlays).toEqual([]);
        expect(scene.prop_layers).toEqual([]);
        // The next visit draws its overlays from scratch.
        expect(scene.overlay_windows.changed()).toBe(true);
    });

    it("is idempotent — a second shutdown does not re-remove the colliders", () => {
        const { scene } = makeScene({ map_colliders: [{ id: "terrain" }] });

        scene.shutdown();
        scene.shutdown();

        expect(scene.physics.world.removeCollider).toHaveBeenCalledTimes(1);
    });
});

describe("BiomeScene.setupMapCollisions", () => {
    it("collides the map with the enemy group as well as the player", () => {
        // Enemies ignoring water and tree trunks was the visible bug: only the
        // player was ever given a collider. Registering the *group* covers
        // enemies spawned later without re-registering.
        const { scene } = makeScene();
        const layers = [{ id: "terrain" }, { id: "structure" }];
        const collider = vi.fn((a, b) => ({ a, b }));
        scene.collision_layers = layers;
        scene.player = { ...scene.player, body: { velocity: { x: 0, y: 0 } } };
        scene.enemies = { ...scene.enemies, name: "enemy-group" };
        scene.physics = { ...scene.physics, add: { collider } };

        scene.setupMapCollisions();

        // One collider per body per collidable layer.
        expect(collider).toHaveBeenCalledTimes(4);
        for (const layer of layers) {
            expect(collider).toHaveBeenCalledWith(scene.player, layer);
            expect(collider).toHaveBeenCalledWith(scene.enemies, layer);
        }
        expect(scene.map_colliders).toHaveLength(4);
    });

    it("registers nothing when the player has no body yet", () => {
        const { scene } = makeScene();
        const collider = vi.fn();
        scene.collision_layers = [{ id: "terrain" }];
        scene.player = { ...scene.player, body: undefined };
        scene.physics = { ...scene.physics, add: { collider } };

        scene.setupMapCollisions();

        expect(collider).not.toHaveBeenCalled();
    });
});

describe("BiomeScene.sortCharactersByFeet", () => {
    // Player and Enemy are Containers holding a Sprite at (0,0) with the default
    // 0.5 origin, so `y` is the character's middle. Props sort on their base.
    // Mixing those references let a bush level with the player draw over them.
    function character(y: number, height: number, depth = 0) {
        const fake = {
            y,
            height,
            depth,
            active: true,
            setDepth: vi.fn((d: number) => {
                fake.depth = d;
                return fake;
            }),
        };
        return fake;
    }

    // The scene iterates the group's own Set rather than a getChildren() copy.
    function withEnemies(scene: { enemies: object }, enemies: object[]): void {
        Object.assign(scene.enemies, { children: new Set(enemies) });
    }

    it("moves the player's depth from its middle to its feet", () => {
        const { scene } = makeScene();
        const player = { ...scene.player, ...character(500, 40) };
        scene.player = player;
        withEnemies(scene, []);

        scene.sortCharactersByFeet();

        expect(player.setDepth).toHaveBeenCalledWith(520);
    });

    it("applies the same correction to every live enemy", () => {
        const { scene } = makeScene();
        scene.player = { ...scene.player, ...character(500, 40) };
        const alive = character(300, 30);
        const dead = { ...character(400, 30), active: false };
        withEnemies(scene, [alive, dead]);

        scene.sortCharactersByFeet();

        expect(alive.setDepth).toHaveBeenCalledWith(315);
        expect(dead.setDepth).not.toHaveBeenCalled();
    });

    it("keeps a prop level with the player behind them", () => {
        // The reported bug: a bush whose base sits between the player's middle
        // and their feet used to sort in front.
        const { scene } = makeScene();
        const player = { ...scene.player, ...character(500, 40) };
        scene.player = player;
        withEnemies(scene, []);

        scene.sortCharactersByFeet();

        const player_depth = player.setDepth.mock.calls[0][0];
        const prop_base_between_middle_and_feet = 510;
        expect(player_depth).toBeGreaterThan(prop_base_between_middle_and_feet);
    });

    // Every depth write queues a full display-list sort in Phaser, even when
    // the value is the same, so a character already on its feet is left alone.
    it("does not rewrite a depth that is already on the feet", () => {
        const { scene } = makeScene();
        const player = { ...scene.player, ...character(500, 40, 520) };
        scene.player = player;
        const idle = character(300, 30, 315);
        withEnemies(scene, [idle]);

        scene.sortCharactersByFeet();

        expect(player.setDepth).not.toHaveBeenCalled();
        expect(idle.setDepth).not.toHaveBeenCalled();
    });

    it("writes an enemy's depth only on frames where it moved", () => {
        const { scene } = makeScene();
        scene.player = { ...scene.player, ...character(500, 40, 520) };
        const enemy = character(300, 30);
        withEnemies(scene, [enemy]);

        scene.sortCharactersByFeet(); // first sight: 0 -> 315
        scene.sortCharactersByFeet(); // stood still
        enemy.y = 310;
        scene.sortCharactersByFeet(); // moved: 325
        scene.sortCharactersByFeet(); // stood still

        expect(enemy.setDepth.mock.calls).toEqual([[315], [325]]);
    });
});

describe("BiomeScene.updatePropOverlays", () => {
    // A prop tile is the *upper* half of a two-tile prop, so it must sort on the
    // bottom of the whole prop — one tile below itself. That is what decides
    // whether a canopy covers a character or the character covers the canopy,
    // and it is the thing a single-depth tile layer cannot express.
    const TILE = 16;
    const SCALE = 2;
    const TILE_PX = TILE * SCALE;

    function makeOverlayScene(tileWorld: { x: number; y: number }) {
        const { scene } = makeScene();
        // Typed args on the chainable setters, so the assertions below can read
        // `mock.calls[0][0]` without TypeScript inferring an empty tuple.
        const sprite = {
            setOrigin: vi.fn((_x: number, _y: number) => sprite),
            setScale: vi.fn((_s: number) => sprite),
            setTexture: vi.fn((_key: string, _frame: number) => sprite),
            setPosition: vi.fn((_x: number, _y: number) => sprite),
            setDepth: vi.fn((_d: number) => sprite),
            setVisible: vi.fn((_v: boolean) => sprite),
            destroy: vi.fn(),
        };
        const tile: {
            x: number;
            y: number;
            index: number;
            tileset: { firstgid: number; name: string };
            properties: { sortBase?: number };
        } = {
            x: 3,
            y: 4,
            index: 250,
            tileset: { firstgid: 239, name: "forest_ [resources]" },
            properties: {},
        };
        const layer = {
            layer: { name: "structure props" },
            getTileAt: vi.fn((_x: number, _y: number): typeof tile | null => tile),
            // Phaser's orthogonal conversion for a layer at (0, 0) scaled by SCALE.
            worldToTileXY: vi.fn(
                (x: number, y: number, _snap: boolean, out: { x: number; y: number }) => {
                    out.x = Math.floor(x / TILE_PX);
                    out.y = Math.floor(y / TILE_PX);
                    return out;
                }
            ),
            tileToWorldXY: vi.fn(() => tileWorld),
        };
        // An 800x600 view at zoom 1 that last rendered at the origin and
        // follows the player (getScroll centres on the point it is given).
        const camera = {
            worldView: { x: 0, y: 0, width: 800, height: 600 },
            width: 800,
            height: 600,
            zoomX: 1,
            zoomY: 1,
            getScroll: (x: number, y: number, out: { x: number; y: number }) => {
                out.x = x - 400;
                out.y = y - 300;
                return out;
            },
        };

        scene.map = { tileWidth: TILE, tileHeight: TILE, width: 100, height: 100 };
        scene.biome = { ...scene.biome, map: { ...scene.biome.map, scale: SCALE } };
        scene.prop_layers = [layer];
        scene.prop_overlays = [];
        scene.player = { ...scene.player, x: 500, y: 500 };
        scene.enemies = { ...scene.enemies, getChildren: vi.fn(() => []), children: new Set() };
        scene.add = { sprite: vi.fn(() => sprite) };
        Object.assign(scene, { cameras: { main: camera } });
        return { scene, sprite, tile, layer, camera };
    }

    // The cells looked up, as [column, row] pairs.
    const lookedUp = (layer: { getTileAt: ReturnType<typeof vi.fn> }) =>
        layer.getTileAt.mock.calls.map(([x, y]) => [x, y]);

    it("sorts a prop on the bottom of the whole prop, one tile below the drawn tile", () => {
        const world = { x: 320, y: 640 };
        const { scene, sprite } = makeOverlayScene(world);

        scene.updatePropOverlays();

        expect(sprite.setPosition).toHaveBeenCalledWith(world.x, world.y);
        expect(sprite.setDepth).toHaveBeenCalledWith(world.y + TILE_PX * 2);
    });

    it("puts the canopy in front of a character behind the tree and behind one in front of it", () => {
        const world = { x: 320, y: 640 };
        const { scene, sprite } = makeOverlayScene(world);

        scene.updatePropOverlays();
        const depth = sprite.setDepth.mock.calls[0][0];

        // Characters sort on their own y (Player/Enemy both setDepth(this.y)).
        const behind_tree = world.y + TILE_PX; // standing above the trunk
        const in_front = world.y + TILE_PX * 3; // standing below the trunk
        expect(depth).toBeGreaterThan(behind_tree);
        expect(depth).toBeLessThan(in_front);
    });

    it("draws each tile from its own tileset's spritesheet", () => {
        const { scene, sprite, tile } = makeOverlayScene({ x: 320, y: 640 });
        tile.tileset = { firstgid: 359, name: "forest_ [fencesAndWalls]" };
        tile.index = 359 + 36;

        scene.updatePropOverlays();

        expect(sprite.setTexture).toHaveBeenCalledWith("forestFenceProps", 36);
    });

    it("sorts a taller prop on the base its sortBase property names", () => {
        // The sliver over the entrance gateway's beam stands two tiles above its posts.
        const world = { x: 320, y: 640 };
        const { scene, sprite, tile } = makeOverlayScene(world);
        tile.properties = { sortBase: 2 };

        scene.updatePropOverlays();

        expect(sprite.setDepth).toHaveBeenCalledWith(world.y + TILE_PX * 3);
    });

    it("skips a tile from a sheet with no overlay spritesheet", () => {
        const { scene, tile } = makeOverlayScene({ x: 320, y: 640 });
        tile.tileset = { firstgid: 1, name: "forest_" };

        scene.updatePropOverlays();

        expect(scene.add.sprite).not.toHaveBeenCalled();
    });

    it("reuses the pool rather than creating a sprite per frame", () => {
        const { scene, sprite } = makeOverlayScene({ x: 320, y: 640 });

        scene.updatePropOverlays();
        scene.updatePropOverlays();
        scene.updatePropOverlays();

        // One distinct tile is found each frame, so the pool never grows past 1.
        expect(scene.add.sprite).toHaveBeenCalledTimes(1);
        expect(scene.prop_overlays).toHaveLength(1);
        expect(sprite.setVisible).toHaveBeenCalledWith(true);
    });

    it("draws the same cell once per prop layer", () => {
        const { scene, layer } = makeOverlayScene({ x: 320, y: 640 });
        scene.prop_layers = [layer, { ...layer, layer: { name: "more props" } }];

        scene.updatePropOverlays();

        // Twelve lookups per layer all land on cell (3, 4): one sprite each.
        expect(scene.prop_overlays).toHaveLength(2);
    });

    it("looks around every live enemy as well as the player", () => {
        const { scene, layer } = makeOverlayScene({ x: 320, y: 640 });
        const alive = { x: 900, y: 300, active: true };
        const dead = { x: 700, y: 700, active: false };
        scene.enemies = { ...scene.enemies, children: new Set([alive, dead]) };

        scene.updatePropOverlays();

        // (900, 300) is cell (28, 9); (700, 700) is (21, 21).
        expect(lookedUp(layer)).toContainEqual([28, 9]);
        expect(lookedUp(layer)).not.toContainEqual([21, 21]);
        expect(lookedUp(layer)).toHaveLength(12 * 2);
    });

    it("looks up the 3x4 window of cells the world points around a character fall in", () => {
        const { scene, layer } = makeOverlayScene({ x: 320, y: 640 });
        // (500, 500) is cell (15, 15): columns 14-16, rows 13-16, row by row.
        scene.updatePropOverlays();

        const expected: number[][] = [];
        for (let row = 13; row <= 16; row++) {
            for (let col = 14; col <= 16; col++) expected.push([col, row]);
        }
        expect(lookedUp(layer)).toEqual(expected);
    });

    describe("incremental redraw", () => {
        it("skips the redraw while no character changes tile", () => {
            const { scene, layer, sprite } = makeOverlayScene({ x: 320, y: 640 });

            scene.updatePropOverlays();
            // Still cell (15, 15), and every window cell with it.
            scene.player.x = 510;
            scene.player.y = 490;
            scene.updatePropOverlays();

            expect(layer.getTileAt).toHaveBeenCalledTimes(12);
            expect(sprite.setPosition).toHaveBeenCalledTimes(1);
        });

        it("redraws when a character crosses a tile edge", () => {
            const { scene, layer } = makeOverlayScene({ x: 320, y: 640 });

            scene.updatePropOverlays();
            scene.player.x = 500 + TILE_PX;
            scene.updatePropOverlays();

            expect(layer.getTileAt).toHaveBeenCalledTimes(24);
            expect(lookedUp(layer).slice(12)).toContainEqual([17, 15]);
        });

        it("redraws when an enemy joins, and when one leaves", () => {
            const { scene, layer } = makeOverlayScene({ x: 320, y: 640 });
            const enemy = { x: 600, y: 600, active: true };

            scene.updatePropOverlays();
            scene.enemies.children!.add(enemy);
            scene.updatePropOverlays();
            expect(layer.getTileAt).toHaveBeenCalledTimes(12 + 24);

            enemy.active = false;
            scene.updatePropOverlays();
            expect(layer.getTileAt).toHaveBeenCalledTimes(12 + 24 + 12);
        });

        it("parks the sprites a redraw no longer needs", () => {
            const { scene, layer, sprite } = makeOverlayScene({ x: 320, y: 640 });
            // A distinct prop tile in every cell around the player.
            layer.getTileAt.mockImplementation((x: number, y: number) => ({
                x,
                y,
                index: 250,
                tileset: { firstgid: 239, name: "forest_ [resources]" },
                properties: {},
            }));

            scene.updatePropOverlays();
            expect(scene.prop_overlays).toHaveLength(12);
            sprite.setVisible.mockClear();

            layer.getTileAt.mockReturnValue(null);
            scene.player.y = 500 + TILE_PX;
            scene.updatePropOverlays();

            expect(sprite.setVisible).toHaveBeenCalledTimes(12);
            expect(sprite.setVisible).toHaveBeenCalledWith(false);
        });

        it("redraws everything once invalidated", () => {
            const { scene, layer } = makeOverlayScene({ x: 320, y: 640 });

            scene.updatePropOverlays();
            scene.overlay_windows.invalidate();
            scene.updatePropOverlays();

            expect(layer.getTileAt).toHaveBeenCalledTimes(24);
        });
    });

    describe("camera cull", () => {
        // Last frame's view is (0, 0)-(800, 600); following the player at
        // (500, 500) moves it to (100, 200)-(900, 800). Plus a 4-tile margin
        // (128px), overlays are drawn for characters in (-128, -128)-(1028, 928).

        it("leaves out a character well outside the camera view", () => {
            const { scene, layer } = makeOverlayScene({ x: 320, y: 640 });
            const far = { x: 1100, y: 500, active: true };
            scene.enemies.children!.add(far);

            scene.updatePropOverlays();

            // Only the player's window.
            expect(layer.getTileAt).toHaveBeenCalledTimes(12);
            expect(layer.worldToTileXY).not.toHaveBeenCalledWith(
                far.x,
                expect.anything(),
                true,
                expect.anything()
            );
        });

        it("keeps a character just past the edge, inside the margin", () => {
            const { scene, layer } = makeOverlayScene({ x: 320, y: 640 });
            scene.enemies.children!.add({ x: 1020, y: 920, active: true });

            scene.updatePropOverlays();

            expect(layer.getTileAt).toHaveBeenCalledTimes(24);
        });

        it("picks a character up as soon as the camera is about to show it", () => {
            const { scene, layer } = makeOverlayScene({ x: 320, y: 640 });
            const far = { x: 1100, y: 500, active: true };
            scene.enemies.children!.add(far);

            scene.updatePropOverlays();
            // The player walks right; the camera has not rendered there yet
            // (worldView is unchanged), but it will follow before drawing.
            scene.player.x = 700;
            scene.updatePropOverlays();

            expect(layer.getTileAt).toHaveBeenCalledTimes(12 + 24);
            // (1100, 500) is cell (34, 15).
            expect(lookedUp(layer).slice(12)).toContainEqual([34, 15]);
        });

        it("drops a character the camera has left behind", () => {
            const { scene, layer, camera } = makeOverlayScene({ x: 320, y: 640 });
            scene.enemies.children!.add({ x: 1000, y: 500, active: true });

            scene.updatePropOverlays();
            expect(layer.getTileAt).toHaveBeenCalledTimes(24);

            // The camera followed the player far left.
            scene.player.x = 100;
            camera.worldView.x = -300;
            scene.updatePropOverlays();
            expect(layer.getTileAt).toHaveBeenCalledTimes(24 + 12);
        });
    });

    it("does nothing when the biome has no prop layers", () => {
        const { scene } = makeOverlayScene({ x: 0, y: 0 });
        scene.prop_layers = [];

        expect(() => scene.updatePropOverlays()).not.toThrow();
        expect(scene.add.sprite).not.toHaveBeenCalled();
    });
});

describe("biome definitions", () => {
    it("gives every biome a distinct background colour", () => {
        const colours = BIOME_IDS.map((id) => BIOMES[id].backgroundColor);
        expect(new Set(colours).size).toBe(BIOME_IDS.length);
    });

    it("gives every biome a non-empty enemy pool of known creatures", () => {
        BIOME_IDS.forEach((id) => {
            expect(BIOMES[id].enemies.length).toBeGreaterThan(0);
            expect(new Set(BIOMES[id].enemies).size).toBe(BIOMES[id].enemies.length);
        });
    });

    it("keeps the boss drawable from the biome's own pool", () => {
        // The boss is promoted from this.enemy_pool, so an empty pool would
        // leave the area with no boss to clear rather than just the wrong one.
        BIOME_IDS.forEach((id) => expect(BIOMES[id].enemies).not.toHaveLength(0));
    });

    it("resolves a known id, and falls back to the default for anything else", () => {
        expect(resolveBiome("tundra").id).toBe("tundra");
        expect(resolveBiome(undefined).id).toBe(DEFAULT_BIOME);
        expect(resolveBiome("swamp" as never).id).toBe(DEFAULT_BIOME);
    });
});

describe("BiomeScene.init", () => {
    it("seeds the scene from the requested biome", () => {
        const { scene } = makeScene();

        scene.init({ type: "Warrior", biome: "tundra" });

        expect(scene.biome).toBe(BIOMES.tundra);
    });

    it("falls back to the default biome when none is given", () => {
        const { scene } = makeScene();

        scene.init({ type: "Warrior" });

        expect(scene.biome).toBe(BIOMES[DEFAULT_BIOME]);
    });
});

describe("BiomeScene.buildSpawnGrid", () => {
    // Reads the tilemap into the pure walkability grid. The fake map is 4x1:
    // start | shoreline (water, walkable) | land | tree (collides). Tiles are
    // 16px art at the biome's 2x scale, so 32 world px each.
    const WORLD_TILE = 32;

    type TileLike = { properties: object; collides: boolean } | null;

    function makeGridScene() {
        const { scene } = makeScene();
        const terrain: TileLike[] = [
            { properties: {}, collides: false },
            { properties: { water: true }, collides: false },
            { properties: {}, collides: false },
            { properties: {}, collides: false },
        ];
        const structure: TileLike[] = [null, null, null, { properties: {}, collides: true }];
        const collisionLayer = (row: TileLike[]) => ({ layer: { data: [row] } });

        const gridScene = scene as unknown as SceneUnderTest & {
            map: {
                width: number;
                height: number;
                tileWidth: number;
                tileHeight: number;
                layers: Array<{ data: TileLike[][] }>;
            };
            buildSpawnGrid(start: { x: number; y: number }): {
                spawnable: Uint8Array;
                tileWidth: number;
            };
        };
        gridScene.map = {
            width: 4,
            height: 1,
            tileWidth: 16,
            tileHeight: 16,
            layers: [{ data: [terrain] }, { data: [structure] }],
        };
        gridScene.collision_layers = [collisionLayer(terrain), collisionLayer(structure)];
        return gridScene;
    }

    it("keeps reachable land and drops shoreline water and solid tiles", () => {
        const scene = makeGridScene();

        const grid = scene.buildSpawnGrid({ x: WORLD_TILE / 2, y: WORLD_TILE / 2 });

        expect([...grid.spawnable]).toEqual([1, 0, 1, 0]);
    });

    it("sizes tiles in world px, applying the biome's render scale", () => {
        const scene = makeGridScene();

        expect(scene.buildSpawnGrid({ x: 0, y: 0 }).tileWidth).toBe(WORLD_TILE);
    });

    it("floods from the tile under the player's start position", () => {
        const scene = makeGridScene();

        // Starting on the solid tree tile reaches nothing.
        const grid = scene.buildSpawnGrid({ x: WORLD_TILE * 3 + 1, y: 1 });

        expect([...grid.spawnable]).toEqual([0, 0, 0, 0]);
    });
});

describe("BiomeScene.findPlayerStart", () => {
    // The map's `spawn` object layer carries a `player-start` point, in
    // unscaled map pixels; the scene scales it to world px.
    type Marker = { name: string; x?: number; y?: number };

    function makeStartScene(marker: Marker | null, solid = false) {
        const { scene } = makeScene();
        const startScene = scene as unknown as SceneUnderTest & {
            map: { findObject: ReturnType<typeof vi.fn> };
            findPlayerStart(): { x: number; y: number } | null;
        };
        startScene.map = {
            tileWidth: 16,
            tileHeight: 16,
            findObject: vi.fn((layer: string, test: (object: Marker) => boolean) =>
                layer === "spawn" && marker && test(marker) ? marker : null
            ),
        };
        startScene.collision_layers = [{ getTileAtWorldXY: vi.fn(() => ({ collides: solid })) }];
        return startScene;
    }

    it("returns the marker scaled to world px", () => {
        const scene = makeStartScene({ name: "player-start", x: 168, y: 248 });

        expect(scene.findPlayerStart()).toEqual({ x: 336, y: 496 });
    });

    it("returns null when the map has no start marker", () => {
        expect(makeStartScene(null).findPlayerStart()).toBeNull();
        expect(makeStartScene({ name: "something-else", x: 1, y: 1 }).findPlayerStart()).toBeNull();
    });

    it("returns null when the marker sits on a solid tile", () => {
        const scene = makeStartScene({ name: "player-start", x: 168, y: 248 }, true);

        expect(scene.findPlayerStart()).toBeNull();
    });
});

describe("BiomeScene town exit", () => {
    // The entrance gateway's opening is a `town-exit` POI. Walking into it opens
    // the same return-to-town confirmation as the HUD button, once per entry.
    type Rect = { x: number; y: number; width: number; height: number };
    type PoiObject = { name: string; x: number; y: number; width: number; height: number };

    function makeExitScene(objects: PoiObject[] | null) {
        const { scene } = makeScene();
        const exitScene = scene as unknown as SceneUnderTest & {
            map: {
                tileWidth: number;
                tileHeight: number;
                getObjectLayer: ReturnType<typeof vi.fn>;
            };
            exit_zones: Rect[];
            in_exit: boolean;
            readExitZones(): Rect[];
            updateExitZone(): void;
        };
        exitScene.map = {
            tileWidth: 16,
            tileHeight: 16,
            getObjectLayer: vi.fn((name: string) =>
                name === "POI" && objects ? { objects } : null
            ),
        };
        exitScene.in_exit = false;
        // The zone is tested against the player's feet: y + height / 2.
        exitScene.player = { ...exitScene.player, alive: true, x: 500, y: 500, height: 30 };
        const moveTo = (feet: { x: number; y: number }) => {
            exitScene.player.x = feet.x;
            exitScene.player.y = feet.y - 15;
        };
        return { scene: exitScene, moveTo };
    }

    const GATE = { name: "town-exit", x: 144, y: 0, width: 48, height: 32 };
    // The zone spans x 288-384, y 0-64 in world px.
    const IN_GATE = { x: 330, y: 50 };
    const AWAY = { x: 330, y: 300 };

    beforeEach(() => {
        vi.spyOn(store, "dispatch");
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    const confirmCalls = () =>
        vi
            .mocked(store.dispatch)
            .mock.calls.filter(
                ([action]) =>
                    (action as { type?: string; payload?: { menu?: string } }).payload?.menu ===
                    "confirmReturn"
            );

    it("reads town-exit rects off the POI layer, scaled to world px", () => {
        const { scene } = makeExitScene([GATE, { ...GATE, name: "other" }]);

        const zones = scene.readExitZones();

        expect(zones).toHaveLength(1);
        expect(zones[0]).toMatchObject({ x: 288, y: 0, width: 96, height: 64 });
    });

    it("has no exit zones when the map carries no POI layer", () => {
        expect(makeExitScene(null).scene.readExitZones()).toEqual([]);
    });

    it("opens the return confirmation once on entering the gateway", () => {
        const { scene, moveTo } = makeExitScene([GATE]);
        scene.exit_zones = scene.readExitZones();

        scene.updateExitZone();
        expect(confirmCalls()).toHaveLength(0);

        moveTo(IN_GATE);
        scene.updateExitZone();
        scene.updateExitZone();
        expect(confirmCalls()).toHaveLength(1);
    });

    it("re-arms only after the player leaves the gateway", () => {
        const { scene, moveTo } = makeExitScene([GATE]);
        scene.exit_zones = scene.readExitZones();

        moveTo(IN_GATE);
        scene.updateExitZone();
        moveTo(AWAY);
        scene.updateExitZone();
        moveTo(IN_GATE);
        scene.updateExitZone();

        expect(confirmCalls()).toHaveLength(2);
    });

    it("ignores a head under the beam while the feet are still outside", () => {
        const { scene, moveTo } = makeExitScene([GATE]);
        scene.exit_zones = scene.readExitZones();

        // Middle of the body inside the zone, feet 15px lower and outside it.
        moveTo({ x: 330, y: 70 });
        scene.updateExitZone();

        expect(confirmCalls()).toHaveLength(0);
    });

    it("does nothing once the player is dead", () => {
        const { scene, moveTo } = makeExitScene([GATE]);
        scene.exit_zones = scene.readExitZones();
        scene.player.alive = false;

        moveTo(IN_GATE);
        scene.updateExitZone();

        expect(confirmCalls()).toHaveLength(0);
    });
});
