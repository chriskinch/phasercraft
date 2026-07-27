import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import GameScene from "./GameScene";
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
    startArea(): void;
    fillToLiveCap(): void;
    onEnemyDead(): void;
    syncAreaProgress(): void;
    areaCleared(): void;
    removeAreaClearedTimer(): void;
    gameOver(): void;
    shutdown(): void;
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
    const scene = Object.create(GameScene.prototype) as SceneUnderTest;
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

describe("GameScene.startArea", () => {
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

describe("GameScene.fillToLiveCap", () => {
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

describe("GameScene.onEnemyDead", () => {
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

describe("GameScene.spawnEnemies", () => {
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

describe("GameScene.areaCleared", () => {
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

describe("GameScene.gameOver", () => {
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

describe("GameScene.shutdown", () => {
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
});
