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

// The enemy collider hands collide() the Enemy. It used to check an Enemy
// `spawned` flag that no longer exists, so no enemy ever sprang the trap.
describe("Trap.collide", () => {
    function makeArmedTrap() {
        const trap = Object.create(Trap.prototype) as Trap;
        trap.emit = vi.fn() as unknown as Trap["emit"];
        trap.destroy = vi.fn() as unknown as Trap["destroy"];
        return trap;
    }

    it("springs on a spawned enemy: emits trap:collide with it and destroys itself", () => {
        const trap = makeArmedTrap();
        const enemy = { state: "spawned" };

        trap.collide(enemy as unknown as Parameters<Trap["collide"]>[0]);

        expect(trap.emit).toHaveBeenCalledWith("trap:collide", enemy);
        expect(trap.destroy).toHaveBeenCalledTimes(1);
    });

    it.each(["spawning", "dead", "despawned"])("ignores an enemy that is %s", (state) => {
        const trap = makeArmedTrap();

        trap.collide({ state } as unknown as Parameters<Trap["collide"]>[0]);

        expect(trap.emit).not.toHaveBeenCalled();
        expect(trap.destroy).not.toHaveBeenCalled();
    });

    it("does not destroy itself when the player touches it", () => {
        const trap = Object.create(Trap.prototype) as Trap;
        const player = {};
        const collider = vi.fn();
        trap.scene = {
            physics: { add: { collider } },
            player,
            active_enemies: {},
        } as unknown as Trap["scene"];

        trap.spawnedHandler();

        expect(collider).toHaveBeenCalledTimes(2);
        expect(collider.mock.calls[1][2]).toBeUndefined();
    });
});
