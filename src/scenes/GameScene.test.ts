import { describe, it, expect, vi } from "vitest";
import GameScene from "./GameScene";

// Regression tests for the Phase 2 fix (issue #307): waveComplete used a raw
// setTimeout, which kept running while the scene clock was paused and could
// fire increaseLevel after the scene had shut down (e.g. ESC to town or game
// over during the 4s loot-collection window).
//
// The methods under test only touch `time` and `next_level_timer`, so we run
// them against a minimal fake scene built on the real prototype — mocking at
// the entity seam rather than booting Phaser.

interface FakeTimer {
    remove: ReturnType<typeof vi.fn>;
}

interface SceneUnderTest {
    time: { delayedCall: ReturnType<typeof vi.fn> };
    next_level_timer?: FakeTimer;
    increaseLevel(): void;
    waveComplete(): void;
    removeNextLevelTimer(): void;
    gameOver(): void;
    shutdown(): void;
    physics: { pause: ReturnType<typeof vi.fn> };
    enemies: { runChildUpdate: boolean };
    UI: { cleanup: ReturnType<typeof vi.fn> };
    player: { cleanup: ReturnType<typeof vi.fn> };
    input: { off: ReturnType<typeof vi.fn> };
    events: { off: ReturnType<typeof vi.fn> };
}

function makeScene(): { scene: SceneUnderTest; pending: FakeTimer } {
    const pending: FakeTimer = { remove: vi.fn() };
    const scene = Object.create(GameScene.prototype) as SceneUnderTest;
    scene.time = { delayedCall: vi.fn(() => pending) };
    scene.physics = { pause: vi.fn() };
    scene.enemies = { runChildUpdate: true };
    scene.UI = { cleanup: vi.fn() };
    scene.player = { cleanup: vi.fn() };
    scene.input = { off: vi.fn() };
    scene.events = { off: vi.fn() };
    return { scene, pending };
}

describe("GameScene.waveComplete", () => {
    it("schedules the next wave on the scene clock, scoped to the scene", () => {
        const { scene } = makeScene();

        scene.waveComplete();

        expect(scene.time.delayedCall).toHaveBeenCalledTimes(1);
        expect(scene.time.delayedCall).toHaveBeenCalledWith(4000, scene.increaseLevel, [], scene);
    });

    it("does not use a raw setTimeout", () => {
        const setTimeoutSpy = vi.spyOn(globalThis, "setTimeout");
        const { scene } = makeScene();

        scene.waveComplete();

        expect(setTimeoutSpy).not.toHaveBeenCalled();
        setTimeoutSpy.mockRestore();
    });

    it("stores the timer so shutdown cleanup can cancel it", () => {
        const { scene, pending } = makeScene();

        scene.waveComplete();
        expect(scene.next_level_timer).toBe(pending);

        scene.removeNextLevelTimer();
        expect(pending.remove).toHaveBeenCalledWith(false);
        expect(scene.next_level_timer).toBeUndefined();
    });

    it("replaces a previously scheduled timer instead of stacking", () => {
        const { scene } = makeScene();
        const stale: FakeTimer = { remove: vi.fn() };
        scene.next_level_timer = stale;

        scene.waveComplete();

        expect(stale.remove).toHaveBeenCalledWith(false);
        expect(scene.time.delayedCall).toHaveBeenCalledTimes(1);
    });
});

describe("GameScene.gameOver", () => {
    it("cancels a pending next-wave timer so no wave spawns mid game-over", () => {
        const { scene, pending } = makeScene();
        scene.waveComplete();

        scene.gameOver();

        expect(pending.remove).toHaveBeenCalledWith(false);
        expect(scene.next_level_timer).toBeUndefined();
        expect(scene.physics.pause).toHaveBeenCalled();
    });
});

describe("GameScene.shutdown", () => {
    it("cancels the pending next-wave timer and runs entity cleanup", () => {
        const { scene, pending } = makeScene();
        scene.waveComplete();

        scene.shutdown();

        expect(pending.remove).toHaveBeenCalledWith(false);
        expect(scene.next_level_timer).toBeUndefined();
        expect(scene.UI.cleanup).toHaveBeenCalled();
        expect(scene.player.cleanup).toHaveBeenCalled();
    });
});
