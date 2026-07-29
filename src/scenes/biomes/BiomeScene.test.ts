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
    physics: { pause: ReturnType<typeof vi.fn> };
    enemies: { runChildUpdate: boolean; getChildren: ReturnType<typeof vi.fn> };
    UI: { cleanup: ReturnType<typeof vi.fn> };
    player: { cleanup: ReturnType<typeof vi.fn>; alive: boolean };
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
    scene.physics = { pause: vi.fn() };
    scene.enemies = { runChildUpdate: true, getChildren: vi.fn(() => []) };
    scene.UI = { cleanup: vi.fn() };
    scene.player = { cleanup: vi.fn(), alive: false };
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
