import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import GameScene from "./GameScene";
import store from "@store";
import { setEnemiesRemaining, setBossActive } from "@store/gameReducer";

// Phase 13 replaced the endless wave loop with a clear-the-area loop: a fixed
// pool of enemies, `live_cap` alive at a time, topped up on each death until the
// pool is dry, then a single boss. Killing the boss clears the area for good.
//
// The methods under test only touch the scene's own counters, the clock, the
// event emitter and the store, so they run against a minimal fake built on the
// real prototype — mocking at the entity seam rather than booting Phaser.

// Enemy construction is the one thing these paths do that needs real Phaser.
vi.mock("@entities/Enemy/AssignType", () => ({ default: vi.fn() }));
vi.mock("@entities/Enemy/Boss", () => ({ default: vi.fn() }));

interface FakeTimer {
    remove: ReturnType<typeof vi.fn>;
}

interface SceneUnderTest {
    time: { delayedCall: ReturnType<typeof vi.fn> };
    global_spawn_time: number;
    pending_spawns: number;
    area_total: number;
    live_cap: number;
    enemy_pool: string[];
    remaining_pool: number;
    enemies_left: number;
    boss_spawned: boolean;
    area_cleared: boolean;
    game_over: boolean;
    area_cleared_ui: { setVisible: ReturnType<typeof vi.fn> };
    startArea(): void;
    onEnemyDeath(): void;
    areaCleared(): void;
    spawnFromPool(count: number): void;
    spawnEnemy: ReturnType<typeof vi.fn>;
    spawnBoss: ReturnType<typeof vi.fn>;
    gameOver(): void;
    shutdown(): void;
    update(time: number, delta: number): void;
    physics: { pause: ReturnType<typeof vi.fn> };
    enemies: { runChildUpdate: boolean; getChildren: ReturnType<typeof vi.fn> };
    UI: { cleanup: ReturnType<typeof vi.fn> };
    player: { cleanup: ReturnType<typeof vi.fn>; alive: boolean };
    input: { off: ReturnType<typeof vi.fn>; activePointer: object };
    cursors: { esc: { isDown: boolean } };
    events: {
        off: ReturnType<typeof vi.fn>;
        on: ReturnType<typeof vi.fn>;
        once: ReturnType<typeof vi.fn>;
        emit: ReturnType<typeof vi.fn>;
    };
}

// Spawns are dripped in via delayedCall; collecting the callbacks lets a test
// decide when each one "lands".
function makeScene(): { scene: SceneUnderTest; timer: FakeTimer; landSpawns: () => void } {
    const timer: FakeTimer = { remove: vi.fn() };
    const pending: Array<() => void> = [];
    const scene = Object.create(GameScene.prototype) as SceneUnderTest;

    scene.time = {
        delayedCall: vi.fn((_delay: number, callback: () => void) => {
            pending.push(callback);
            return timer;
        }),
    };
    scene.global_spawn_time = 200;
    scene.pending_spawns = 0;
    scene.area_total = 20;
    scene.live_cap = 5;
    scene.enemy_pool = ["baby-ghoul", "ghoul", "imp"];
    scene.remaining_pool = 0;
    scene.enemies_left = 0;
    scene.boss_spawned = false;
    scene.area_cleared = false;
    scene.game_over = false;
    scene.area_cleared_ui = { setVisible: vi.fn() };
    scene.spawnEnemy = vi.fn();
    scene.spawnBoss = vi.fn();
    scene.physics = { pause: vi.fn() };
    scene.enemies = { runChildUpdate: true, getChildren: vi.fn(() => []) };
    scene.UI = { cleanup: vi.fn() };
    scene.player = { cleanup: vi.fn(), alive: false };
    scene.input = { off: vi.fn(), activePointer: {} };
    scene.cursors = { esc: { isDown: false } };
    scene.events = { off: vi.fn(), on: vi.fn(), once: vi.fn(), emit: vi.fn() };

    return {
        scene,
        timer,
        landSpawns: () => {
            pending.splice(0).forEach((callback) => callback());
        },
    };
}

let dispatch: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
    dispatch = vi.spyOn(store, "dispatch").mockImplementation((action) => action);
});

afterEach(() => {
    vi.restoreAllMocks();
});

describe("GameScene.startArea", () => {
    it("seeds the pool and opens with live_cap enemies, not the whole pool", () => {
        const { scene, landSpawns } = makeScene();

        scene.startArea();
        landSpawns();

        expect(scene.spawnEnemy).toHaveBeenCalledTimes(5);
        // 20 total, 5 drawn for the opening batch.
        expect(scene.remaining_pool).toBe(15);
        expect(scene.enemies_left).toBe(20);
    });

    it("publishes the starting count and clears any stale boss flag", () => {
        const { scene } = makeScene();

        scene.startArea();

        expect(dispatch).toHaveBeenCalledWith(setEnemiesRemaining(20));
        expect(dispatch).toHaveBeenCalledWith(setBossActive(false));
    });

    it("drops a previous run's death handler before registering its own", () => {
        // create() re-runs on a reused scene instance, so a stale handler would
        // otherwise double up and top the pool off twice per kill.
        const { scene } = makeScene();

        scene.startArea();

        expect(scene.events.off).toHaveBeenCalledWith("enemy:dead", scene.onEnemyDeath, scene);
        expect(scene.events.on).toHaveBeenCalledWith("enemy:dead", scene.onEnemyDeath, scene);
        expect(scene.events.off).toHaveBeenCalledBefore(
            scene.events.on as unknown as ReturnType<typeof vi.fn>
        );
    });

    it("never draws more than the pool holds", () => {
        const { scene, landSpawns } = makeScene();
        scene.area_total = 3;

        scene.startArea();
        landSpawns();

        expect(scene.spawnEnemy).toHaveBeenCalledTimes(3);
        expect(scene.remaining_pool).toBe(0);
    });
});

describe("GameScene.onEnemyDeath", () => {
    it("replaces each kill while the pool still holds enemies", () => {
        const { scene, landSpawns } = makeScene();
        scene.startArea();
        landSpawns();
        scene.spawnEnemy.mockClear();

        scene.onEnemyDeath();
        landSpawns();

        expect(scene.spawnEnemy).toHaveBeenCalledTimes(1);
        expect(scene.remaining_pool).toBe(14);
        expect(scene.enemies_left).toBe(19);
        expect(dispatch).toHaveBeenCalledWith(setEnemiesRemaining(19));
    });

    it("stops topping up once the pool is exhausted", () => {
        const { scene, landSpawns } = makeScene();
        scene.remaining_pool = 0;
        scene.enemies_left = 3;
        scene.spawnEnemy.mockClear();

        scene.onEnemyDeath();
        landSpawns();

        expect(scene.spawnEnemy).not.toHaveBeenCalled();
        expect(scene.enemies_left).toBe(2);
    });

    it("counts every enemy down to zero across a full area", () => {
        const { scene, landSpawns } = makeScene();
        scene.startArea();
        landSpawns();

        for (let i = 0; i < scene.area_total; i++) {
            scene.onEnemyDeath();
            landSpawns();
        }

        expect(scene.enemies_left).toBe(0);
        expect(scene.remaining_pool).toBe(0);
        // 20 spawned in total: the opening 5 plus 15 top-ups.
        expect(scene.spawnEnemy).toHaveBeenCalledTimes(20);
    });

    it("treats a death while the boss is up as the boss dying", () => {
        const { scene } = makeScene();
        scene.boss_spawned = true;
        scene.enemies_left = 0;

        scene.onEnemyDeath();

        expect(scene.area_cleared).toBe(true);
        expect(dispatch).toHaveBeenCalledWith(setBossActive(false));
    });
});

describe("GameScene.areaCleared", () => {
    it("delays the banner so the boss's loot can drop first", () => {
        const { scene, landSpawns } = makeScene();

        scene.areaCleared();

        expect(scene.area_cleared_ui.setVisible).not.toHaveBeenCalled();
        expect(scene.time.delayedCall).toHaveBeenCalledWith(1500, expect.any(Function), [], scene);

        landSpawns();
        expect(scene.area_cleared_ui.setVisible).toHaveBeenCalledWith(true);
    });

    it("does not pause the scene clock", () => {
        // The old level-complete banner set time.paused, which froze loot pickup
        // and the ESC exit. A cleared area has to stay playable so the player can
        // collect and leave.
        const { scene } = makeScene();

        scene.areaCleared();

        expect(scene).not.toHaveProperty("time.paused", true);
    });
});

describe("GameScene boss trigger", () => {
    it("spawns the boss once the pool, the pending spawns and the group are all empty", () => {
        const { scene } = makeScene();

        scene.update(0, 16);

        expect(scene.spawnBoss).toHaveBeenCalledTimes(1);
    });

    it("waits while scheduled spawns have not landed yet", () => {
        const { scene } = makeScene();
        scene.pending_spawns = 2;

        scene.update(0, 16);

        expect(scene.spawnBoss).not.toHaveBeenCalled();
    });

    it("waits while the pool still holds unspawned enemies", () => {
        const { scene } = makeScene();
        scene.remaining_pool = 4;

        scene.update(0, 16);

        expect(scene.spawnBoss).not.toHaveBeenCalled();
    });

    it("waits while enemies are still alive", () => {
        const { scene } = makeScene();
        scene.enemies.getChildren = vi.fn(() => [{}]);

        scene.update(0, 16);

        expect(scene.spawnBoss).not.toHaveBeenCalled();
    });

    it("does not spawn a second boss while the first is alive", () => {
        const { scene } = makeScene();
        scene.boss_spawned = true;

        scene.update(0, 16);

        expect(scene.spawnBoss).not.toHaveBeenCalled();
    });

    it("does not respawn anything once the area is cleared", () => {
        const { scene } = makeScene();
        scene.area_cleared = true;
        scene.boss_spawned = false;

        scene.update(0, 16);
        scene.update(16, 16);

        expect(scene.spawnBoss).not.toHaveBeenCalled();
    });

    it("does not spawn a boss during the game-over transition", () => {
        const { scene } = makeScene();
        scene.game_over = true;

        scene.update(0, 16);

        expect(scene.spawnBoss).not.toHaveBeenCalled();
    });
});

describe("GameScene.spawnFromPool", () => {
    it("counts scheduled spawns as pending until each one lands", () => {
        const { scene, landSpawns } = makeScene();
        scene.remaining_pool = 2;

        scene.spawnFromPool(2);
        expect(scene.pending_spawns).toBe(2);

        landSpawns();
        expect(scene.pending_spawns).toBe(0);
        expect(scene.spawnEnemy).toHaveBeenCalledTimes(2);
    });

    it("only ever draws creatures from the area's own pool", () => {
        const { scene, landSpawns } = makeScene();
        scene.remaining_pool = 10;

        scene.spawnFromPool(10);
        landSpawns();

        scene.spawnEnemy.mock.calls.forEach(([id]) => {
            expect(scene.enemy_pool).toContain(id);
        });
    });

    it("is a no-op for a non-positive count or an empty pool", () => {
        const { scene } = makeScene();
        scene.remaining_pool = 0;

        scene.spawnFromPool(3);
        scene.remaining_pool = 5;
        scene.spawnFromPool(0);

        expect(scene.time.delayedCall).not.toHaveBeenCalled();
        expect(scene.pending_spawns).toBe(0);
    });
});

describe("GameScene.gameOver", () => {
    it("pauses physics and stops running enemy updates", () => {
        const { scene } = makeScene();

        scene.gameOver();

        expect(scene.game_over).toBe(true);
        expect(scene.physics.pause).toHaveBeenCalled();
        expect(scene.enemies.runChildUpdate).toBe(false);
    });
});

describe("GameScene.shutdown", () => {
    it("runs entity cleanup and releases the death handler it registered", () => {
        const { scene } = makeScene();

        scene.shutdown();

        expect(scene.UI.cleanup).toHaveBeenCalled();
        expect(scene.player.cleanup).toHaveBeenCalled();
        // Same (event, fn, context) triple used to register it, or the listener
        // would survive the scene transition.
        expect(scene.events.off).toHaveBeenCalledWith("enemy:dead", scene.onEnemyDeath, scene);
    });
});
