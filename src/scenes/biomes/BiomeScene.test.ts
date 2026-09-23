import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import BiomeScene from "./BiomeScene";
import { BIOMES, BIOME_IDS, DEFAULT_BIOME, resolveBiome } from "./biomes";
import store from "@store";

// The area loop replaces the old wave counter: an area holds a fixed pool of
// enemies, keeps `live_cap` of them alive at a time, and once the pool is spent
// and the field is clear a boss spawns. Killing the boss clears the area with
// no respawn.
//
// These methods only touch scene fields, the clock and the event emitter, so we
// run them against a minimal fake scene built on the real prototype — mocking at
// the entity seam rather than booting Phaser (the Phase 2 convention).

interface FakeTimer {
    remove: ReturnType<typeof vi.fn>;
}

interface SceneUnderTest {
    time: { delayedCall: ReturnType<typeof vi.fn> };
    area_cleared_timer?: FakeTimer;
    area_cleared_ui: { setVisible: ReturnType<typeof vi.fn> };
    pending_spawns: number;
    pool_remaining: number;
    enemies_alive: number;
    live_cap: number;
    enemy_pool: string[];
    boss_spawned: boolean;
    area_cleared: boolean;
    game_over: boolean;
    global_spawn_time: number;
    biome: (typeof BIOMES)[keyof typeof BIOMES];
    config: { type?: string; biome?: string };
    init(config: { type?: string; biome?: string }): void;
    startArea(): void;
    fillToLiveCap(): void;
    onEnemyDead(): void;
    syncAreaProgress(): void;
    areaCleared(): void;
    removeAreaClearedTimer(): void;
    gameOver(): void;
    shutdown(): void;
    travel_subscription?: ReturnType<typeof vi.fn>;
    spawnEnemies(list: string[]): void;
    spawnEnemy: ReturnType<typeof vi.fn>;
    spawnBoss: ReturnType<typeof vi.fn>;
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
    setupMapCollisions(): void;
    updatePropOverlays(): void;
    sortCharactersByFeet(): void;
    add: { sprite: ReturnType<typeof vi.fn> };
    map: { tileWidth: number; tileHeight: number };
    scale: { width: number; height: number };
    isOpenAt: ReturnType<typeof vi.fn>;
    spawnPointNearPlayer(): { x: number; y: number };
    enemies: { runChildUpdate: boolean; getChildren: ReturnType<typeof vi.fn>; name?: string };
    UI: { cleanup: ReturnType<typeof vi.fn> };
    player: {
        cleanup: ReturnType<typeof vi.fn>;
        alive: boolean;
        x: number;
        y: number;
        body?: object;
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
} {
    const pending: FakeTimer = { remove: vi.fn() };
    const scene = Object.create(BiomeScene.prototype) as SceneUnderTest;
    scene.time = { delayedCall: vi.fn(() => pending) };
    scene.area_cleared_ui = { setVisible: vi.fn() };
    scene.pending_spawns = 0;
    scene.pool_remaining = 20;
    scene.enemies_alive = 0;
    scene.live_cap = 5;
    scene.enemy_pool = ["baby-ghoul", "ghoul"];
    scene.boss_spawned = false;
    scene.area_cleared = false;
    scene.game_over = false;
    scene.global_spawn_time = 200;
    scene.biome = BIOMES[DEFAULT_BIOME];
    scene.physics = { pause: vi.fn(), world: { removeCollider: vi.fn() } };
    // Object.create() skips field initialisers, so the tilemap collision state
    // the scene sets up in create() has to be seeded here.
    scene.map_colliders = [];
    scene.collision_layers = [];
    scene.prop_overlays = [];
    scene.prop_layers = [];
    scene.add = { sprite: vi.fn() };
    scene.enemies = { runChildUpdate: true, getChildren: vi.fn(() => []) };
    scene.UI = { cleanup: vi.fn() };
    scene.player = { cleanup: vi.fn(), alive: false, x: 0, y: 0 };
    scene.input = { off: vi.fn(), activePointer: {} };
    scene.cursors = { esc: { isDown: false } };
    scene.events = { on: vi.fn(), off: vi.fn(), once: vi.fn(), emit: vi.fn() };
    scene.spawnEnemy = vi.fn();
    scene.spawnBoss = vi.fn(() => {
        scene.boss_spawned = true;
    });
    Object.assign(scene, overrides);
    return { scene, pending };
}

// Runs every spawn callback the scene scheduled on the clock.
function landSpawns(scene: SceneUnderTest): void {
    const calls = scene.time.delayedCall.mock.calls as Array<[number, () => void]>;
    calls.forEach(([, callback]) => callback());
    scene.time.delayedCall.mockClear();
}

beforeEach(() => {
    vi.spyOn(store, "dispatch").mockImplementation((action) => action);
});

afterEach(() => {
    vi.restoreAllMocks();
});

describe("BiomeScene.startArea", () => {
    it("registers the death listener exactly once across re-entry", () => {
        const { scene } = makeScene();

        scene.startArea();

        expect(scene.events.off).toHaveBeenCalledWith("enemy:dead", scene.onEnemyDead, scene);
        expect(scene.events.on).toHaveBeenCalledWith("enemy:dead", scene.onEnemyDead, scene);
    });

    it("clears a stale boss flag so re-entry does not read BOSS", () => {
        const { scene } = makeScene();

        scene.startArea();

        expect(store.dispatch).toHaveBeenCalledWith({
            type: "SET_BOSS_ACTIVE",
            payload: { value: false },
        });
    });
});

describe("BiomeScene.fillToLiveCap", () => {
    it("fills up to the live cap and draws those enemies out of the pool", () => {
        const { scene } = makeScene();

        scene.fillToLiveCap();
        landSpawns(scene);

        expect(scene.spawnEnemy).toHaveBeenCalledTimes(5);
        expect(scene.enemies_alive).toBe(5);
        expect(scene.pool_remaining).toBe(15);
    });

    it("counts pending spawns against the cap so it cannot over-fill", () => {
        const { scene } = makeScene({ enemies_alive: 3, pending_spawns: 2 });

        scene.fillToLiveCap();

        expect(scene.spawnEnemy).not.toHaveBeenCalled();
        expect(scene.pool_remaining).toBe(20);
    });

    it("never spawns more than the pool has left", () => {
        const { scene } = makeScene({ pool_remaining: 2 });

        scene.fillToLiveCap();
        landSpawns(scene);

        expect(scene.spawnEnemy).toHaveBeenCalledTimes(2);
        expect(scene.pool_remaining).toBe(0);
    });

    it("is a no-op once the pool is exhausted", () => {
        const { scene } = makeScene({ pool_remaining: 0 });

        scene.fillToLiveCap();

        expect(scene.time.delayedCall).not.toHaveBeenCalled();
    });

    it("only draws from the area's own enemy pool", () => {
        const { scene } = makeScene({ enemy_pool: ["slime"] });

        scene.fillToLiveCap();
        landSpawns(scene);

        const spawned = scene.spawnEnemy.mock.calls.map((call) => call[0]);
        expect(new Set(spawned)).toEqual(new Set(["slime"]));
    });
});

describe("BiomeScene.onEnemyDead", () => {
    it("tops the area back up as enemies die", () => {
        const { scene } = makeScene({ enemies_alive: 5, pool_remaining: 15 });

        scene.onEnemyDead();
        landSpawns(scene);

        expect(scene.spawnEnemy).toHaveBeenCalledTimes(1);
        expect(scene.enemies_alive).toBe(5);
        expect(scene.pool_remaining).toBe(14);
    });

    it("does not top up past the pool, and spawns the boss when the field clears", () => {
        const { scene } = makeScene({ enemies_alive: 1, pool_remaining: 0 });

        scene.onEnemyDead();

        expect(scene.spawnEnemy).not.toHaveBeenCalled();
        expect(scene.spawnBoss).toHaveBeenCalledTimes(1);
    });

    it("waits for in-flight spawns before calling the area clear", () => {
        const { scene } = makeScene({ enemies_alive: 1, pool_remaining: 0, pending_spawns: 1 });

        scene.onEnemyDead();

        expect(scene.spawnBoss).not.toHaveBeenCalled();
    });

    it("clears the area when the boss dies, and does not respawn anything", () => {
        const { scene } = makeScene({
            enemies_alive: 1,
            pool_remaining: 0,
            boss_spawned: true,
        });

        scene.onEnemyDead();

        expect(scene.area_cleared).toBe(true);
        expect(scene.spawnEnemy).not.toHaveBeenCalled();
        expect(scene.spawnBoss).not.toHaveBeenCalled();
    });

    it("ignores deaths once the game is over", () => {
        const { scene } = makeScene({ enemies_alive: 1, pool_remaining: 0, game_over: true });

        scene.onEnemyDead();

        expect(scene.spawnBoss).not.toHaveBeenCalled();
        expect(scene.enemies_alive).toBe(1);
    });
});

describe("BiomeScene.spawnEnemies", () => {
    it("counts scheduled spawns as pending until each one lands", () => {
        const { scene } = makeScene();

        scene.spawnEnemies(["baby-ghoul", "baby-ghoul"]);
        expect(scene.pending_spawns).toBe(2);

        landSpawns(scene);
        expect(scene.pending_spawns).toBe(0);
        expect(scene.enemies_alive).toBe(2);
        expect(scene.spawnEnemy).toHaveBeenCalledTimes(2);
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
    it("cancels the pending banner timer and stops topping the area up", () => {
        const { scene, pending } = makeScene();
        scene.areaCleared();

        scene.gameOver();

        expect(pending.remove).toHaveBeenCalledWith(false);
        expect(scene.area_cleared_timer).toBeUndefined();
        expect(scene.physics.pause).toHaveBeenCalled();
        expect(scene.events.off).toHaveBeenCalledWith("enemy:dead", scene.onEnemyDead, scene);
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
        scene.player = { ...scene.player, body: {} };
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
    function character(y: number, height: number) {
        return { y, height, active: true, setDepth: vi.fn() };
    }

    it("moves the player's depth from its middle to its feet", () => {
        const { scene } = makeScene();
        const player = { ...scene.player, ...character(500, 40) };
        scene.player = player;
        scene.enemies = { ...scene.enemies, getChildren: vi.fn(() => []) };

        scene.sortCharactersByFeet();

        expect(player.setDepth).toHaveBeenCalledWith(520);
    });

    it("applies the same correction to every live enemy", () => {
        const { scene } = makeScene();
        scene.player = { ...scene.player, ...character(500, 40) };
        const alive = character(300, 30);
        const dead = { ...character(400, 30), active: false };
        scene.enemies = { ...scene.enemies, getChildren: vi.fn(() => [alive, dead]) };

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
        scene.enemies = { ...scene.enemies, getChildren: vi.fn(() => []) };

        scene.sortCharactersByFeet();

        const player_depth = player.setDepth.mock.calls[0][0];
        const prop_base_between_middle_and_feet = 510;
        expect(player_depth).toBeGreaterThan(prop_base_between_middle_and_feet);
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
            setFrame: vi.fn((_f: number) => sprite),
            setPosition: vi.fn((_x: number, _y: number) => sprite),
            setDepth: vi.fn((_d: number) => sprite),
            setVisible: vi.fn((_v: boolean) => sprite),
            destroy: vi.fn(),
        };
        const tile = { x: 3, y: 4, index: 250, tileset: { firstgid: 239 } };
        const layer = {
            layer: { name: "structure props" },
            getTileAtWorldXY: vi.fn(() => tile),
            tileToWorldXY: vi.fn(() => tileWorld),
        };

        scene.map = { tileWidth: TILE, tileHeight: TILE };
        scene.biome = { ...scene.biome, map: { ...scene.biome.map, scale: SCALE } };
        scene.prop_layers = [layer];
        scene.prop_overlays = [];
        scene.player = { ...scene.player, x: 500, y: 500 };
        scene.enemies = { ...scene.enemies, getChildren: vi.fn(() => []) };
        scene.add = { sprite: vi.fn(() => sprite) };
        return { scene, sprite, tile, layer };
    }

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

    it("does nothing when the biome has no prop layers", () => {
        const { scene } = makeOverlayScene({ x: 0, y: 0 });
        scene.prop_layers = [];

        expect(() => scene.updatePropOverlays()).not.toThrow();
        expect(scene.add.sprite).not.toHaveBeenCalled();
    });
});

describe("BiomeScene.spawnPointNearPlayer", () => {
    // The spawn ring is the reason enemies still appear around the player once
    // the world is 300x300 rather than one viewport wide.
    function makeSpawnScene(
        open: boolean,
        overrides: Partial<SceneUnderTest> = {}
    ): SceneUnderTest {
        const { scene } = makeScene(overrides);
        scene.player = { ...scene.player, x: 5000, y: 5000 };
        scene.scale = { width: 800, height: 600 };
        scene.map = { tileWidth: 16, tileHeight: 16 };
        scene.physics.world.bounds = { left: 0, top: 0, right: 9600, bottom: 9600 };
        scene.isOpenAt = vi.fn(() => open);
        return scene;
    }

    it("lands inside the viewport radius but outside the player's personal space", () => {
        const scene = makeSpawnScene(true);

        for (let i = 0; i < 200; i++) {
            const { x, y } = scene.spawnPointNearPlayer();
            const distance = Math.hypot(x - scene.player.x, y - scene.player.y);
            // Upper bound is half the shorter viewport side, so a spawn is
            // always on screen whichever way round the window is.
            expect(distance).toBeLessThanOrEqual(300.0001);
            expect(distance).toBeGreaterThanOrEqual(179.9999);
        }
    });

    it("clamps to the world bounds rather than spawning outside the map", () => {
        const scene = makeSpawnScene(true);
        scene.player = { ...scene.player, x: 0, y: 0 };

        for (let i = 0; i < 200; i++) {
            const { x, y } = scene.spawnPointNearPlayer();
            expect(x).toBeGreaterThanOrEqual(16);
            expect(y).toBeGreaterThanOrEqual(16);
        }
    });

    it("gives up after a bounded number of tries when everywhere is blocked", () => {
        const scene = makeSpawnScene(false);

        const { x, y } = scene.spawnPointNearPlayer();

        // Still returns a usable point rather than looping forever.
        expect(Number.isFinite(x)).toBe(true);
        expect(Number.isFinite(y)).toBe(true);
        expect(scene.isOpenAt).toHaveBeenCalledTimes(12);
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
        // spawnBoss samples this.enemy_pool, so an empty pool would break the
        // clear condition rather than just spawn the wrong creature.
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

describe("BiomeScene pool sourcing", () => {
    it("only ever spawns creatures belonging to the active biome", () => {
        BIOME_IDS.forEach((id) => {
            const { scene } = makeScene({
                biome: BIOMES[id],
                enemy_pool: BIOMES[id].enemies,
                pool_remaining: BIOMES[id].total,
                live_cap: BIOMES[id].liveCap,
            });

            scene.fillToLiveCap();
            landSpawns(scene);

            const spawned = scene.spawnEnemy.mock.calls.map((call) => call[0]);
            expect(spawned.length).toBeGreaterThan(0);
            spawned.forEach((creature) => expect(BIOMES[id].enemies).toContain(creature));
        });
    });
});
