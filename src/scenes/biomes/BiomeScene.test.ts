import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import BiomeScene from "./BiomeScene";
import { BIOMES, BIOME_IDS, DEFAULT_BIOME, resolveBiome } from "./biomes";
import store from "@store";
import { DEFAULT_AREA_TUNING } from "@config/area";

// These scene helpers only touch scene fields, the clock and the event emitter,
// so we run them against a minimal fake scene built on the real prototype —
// mocking at the entity seam rather than booting Phaser (the Phase 2
// convention).

interface FakeTimer {
    remove: ReturnType<typeof vi.fn>;
}

interface SceneUnderTest {
    time: { delayedCall: ReturnType<typeof vi.fn>; addEvent: ReturnType<typeof vi.fn> };
    area_cleared_timer?: FakeTimer;
    area_cleared_ui: { setVisible: ReturnType<typeof vi.fn> };
    enemy_pool: string[];
    director?: { cleanup: ReturnType<typeof vi.fn>; update: ReturnType<typeof vi.fn> };
    area_tuning: typeof DEFAULT_AREA_TUNING;
    area_cleared: boolean;
    biome: (typeof BIOMES)[keyof typeof BIOMES];
    config: { type?: string; biome?: string };
    init(config: { type?: string; biome?: string }): void;
    startArea(): void;
    areaCleared(): void;
    removeAreaClearedTimer(): void;
    gameOver(): void;
    shutdown(): void;
    travel_subscription?: ReturnType<typeof vi.fn>;
    physics: {
        pause: ReturnType<typeof vi.fn>;
        world: {
            removeCollider: ReturnType<typeof vi.fn>;
            bounds: { left: number; top: number; right: number; bottom: number };
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
    isFootprintSpawnable(point: { x: number; y: number }, footprint: number): boolean;
    enemies: { runChildUpdate: boolean; getChildren: ReturnType<typeof vi.fn>; name?: string };
    UI: { cleanup: ReturnType<typeof vi.fn> };
    player: {
        cleanup: ReturnType<typeof vi.fn>;
        alive: boolean;
        x: number;
        y: number;
        body?: { velocity?: { x: number; y: number } };
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
    scene.time = { delayedCall: vi.fn(() => pending), addEvent: vi.fn(() => pending) };
    scene.area_cleared_ui = { setVisible: vi.fn() };
    scene.enemy_pool = ["baby-ghoul", "ghoul"];
    scene.area_tuning = DEFAULT_AREA_TUNING;
    scene.area_cleared = false;
    scene.biome = BIOMES[DEFAULT_BIOME];
    scene.physics = {
        pause: vi.fn(),
        world: {
            removeCollider: vi.fn(),
            bounds: { left: 0, top: 0, right: 9600, bottom: 9600 },
        },
    };
    // Object.create() skips field initialisers, so the tilemap collision state
    // the scene sets up in create() has to be seeded here.
    scene.map_colliders = [];
    scene.collision_layers = [];
    scene.prop_overlays = [];
    scene.prop_layers = [];
    scene.add = { sprite: vi.fn() };
    scene.map = { tileWidth: 16, tileHeight: 16 };
    scene.scale = { width: 800, height: 600 };
    scene.isOpenAt = vi.fn(() => true);
    scene.enemies = { runChildUpdate: true, getChildren: vi.fn(() => []) };
    scene.UI = { cleanup: vi.fn() };
    scene.player = {
        cleanup: vi.fn(),
        alive: false,
        x: 0,
        y: 0,
        body: { velocity: { x: 0, y: 0 } },
    };
    scene.input = { off: vi.fn(), activePointer: {} };
    scene.cursors = { esc: { isDown: false } };
    scene.events = { on: vi.fn(), off: vi.fn(), once: vi.fn(), emit: vi.fn() };
    Object.assign(scene, overrides);
    return { scene, pending };
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
        scene.startArea();

        expect(scene.events.off).toHaveBeenCalledWith(
            "enemy:dead",
            expect.any(Function),
            expect.anything()
        );
        expect(scene.events.on).toHaveBeenCalledWith(
            "enemy:dead",
            expect.any(Function),
            expect.anything()
        );
        expect(scene.events.off).toHaveBeenCalledWith(
            "enemy:despawned",
            expect.any(Function),
            expect.anything()
        );
        expect(scene.events.on).toHaveBeenCalledWith(
            "enemy:despawned",
            expect.any(Function),
            expect.anything()
        );
        expect(scene.time.addEvent).toHaveBeenCalledTimes(2);
    });

    it("clears a stale boss flag so re-entry does not read BOSS", () => {
        const { scene } = makeScene();

        scene.startArea();

        expect(store.dispatch).toHaveBeenCalledWith({
            type: "SET_BOSS_ACTIVE",
            payload: { value: false },
        });
        expect(store.dispatch).toHaveBeenCalledWith({
            type: "SET_ENEMIES_REMAINING",
            payload: { value: 20 },
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
    it("cancels the pending banner timer and releases the spawn director", () => {
        const { scene, pending } = makeScene();
        scene.startArea();
        scene.areaCleared();

        scene.gameOver();

        expect(pending.remove).toHaveBeenCalledWith(false);
        expect(scene.area_cleared_timer).toBeUndefined();
        expect(scene.physics.pause).toHaveBeenCalled();
        expect(scene.events.off).toHaveBeenCalledWith(
            "enemy:dead",
            expect.any(Function),
            expect.anything()
        );
        expect(scene.events.off).toHaveBeenCalledWith(
            "enemy:despawned",
            expect.any(Function),
            expect.anything()
        );
    });
});

describe("BiomeScene.shutdown", () => {
    it("cancels the banner timer, drops the director listeners and runs entity cleanup", () => {
        const { scene, pending } = makeScene();
        scene.startArea();
        scene.areaCleared();

        scene.shutdown();

        expect(pending.remove).toHaveBeenCalledWith(false);
        expect(scene.area_cleared_timer).toBeUndefined();
        expect(scene.events.off).toHaveBeenCalledWith(
            "enemy:dead",
            expect.any(Function),
            expect.anything()
        );
        expect(scene.events.off).toHaveBeenCalledWith(
            "enemy:despawned",
            expect.any(Function),
            expect.anything()
        );
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

describe("BiomeScene.isFootprintSpawnable", () => {
    it("rejects a spawn when any point in the footprint hits blocked terrain", () => {
        const { scene } = makeScene();
        scene.isOpenAt = vi
            .fn()
            .mockReturnValueOnce(true)
            .mockReturnValueOnce(true)
            .mockReturnValueOnce(false);

        expect(scene.isFootprintSpawnable({ x: 100, y: 100 }, 10)).toBe(false);
    });

    it("rejects a spawn when the footprint would leave the world bounds", () => {
        const { scene } = makeScene();

        expect(scene.isFootprintSpawnable({ x: 5, y: 100 }, 10)).toBe(false);
        expect(scene.isOpenAt).toHaveBeenCalledTimes(2);
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
