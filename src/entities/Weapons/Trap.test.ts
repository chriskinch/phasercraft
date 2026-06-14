import { describe, it, expect, vi } from "vitest";
import Trap from "./Trap";

// Regression test for the Phase 2 Trap lifecycle fix (issue #307). The trap's
// own "trap:spawned" listener is removed by Phaser's destroy(), but the lifespan
// timer and the two colliders are not. cleanup() releases them so stale
// colliders don't accumulate during a run. Constructor-free fake on the real
// prototype.

interface TrapUnderTest {
    lifespanTimer?: { remove: ReturnType<typeof vi.fn> };
    enemyCollider?: object;
    playerCollider?: object;
    scene: { physics: { world: { removeCollider: ReturnType<typeof vi.fn> } } };
    cleanup(): void;
}

function makeTrap(): TrapUnderTest {
    const trap = Object.create(Trap.prototype) as TrapUnderTest;
    trap.scene = { physics: { world: { removeCollider: vi.fn() } } };
    return trap;
}

describe("Trap.cleanup", () => {
    it("removes the lifespan timer and both colliders", () => {
        const trap = makeTrap();
        trap.lifespanTimer = { remove: vi.fn() };
        trap.enemyCollider = { id: "enemy" };
        trap.playerCollider = { id: "player" };

        trap.cleanup();

        expect(trap.lifespanTimer.remove).toHaveBeenCalledTimes(1);
        expect(trap.scene.physics.world.removeCollider).toHaveBeenCalledWith(trap.enemyCollider);
        expect(trap.scene.physics.world.removeCollider).toHaveBeenCalledWith(trap.playerCollider);
    });

    it("does not throw when colliders were never created (trap destroyed before spawn)", () => {
        const trap = makeTrap();
        trap.lifespanTimer = { remove: vi.fn() };

        expect(() => trap.cleanup()).not.toThrow();
        expect(trap.scene.physics.world.removeCollider).not.toHaveBeenCalled();
    });
});
