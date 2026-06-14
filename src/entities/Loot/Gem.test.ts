import { describe, it, expect, vi } from "vitest";
import Gem from "./Gem";

// Regression test for the Phase 2 Gem lifecycle fix (issue #307). The gem's own
// "loot:collect" listener is removed by Phaser's destroy(), but the activate
// timer and the player collider are not — stale colliders accumulate during a
// run. cleanup() releases both. Constructor-free fake on the real prototype.

interface GemUnderTest {
    activateTimer?: { remove: ReturnType<typeof vi.fn> };
    collider?: object;
    scene: { physics: { world: { removeCollider: ReturnType<typeof vi.fn> } } };
    cleanup(): void;
}

function makeGem(): GemUnderTest {
    const gem = Object.create(Gem.prototype) as GemUnderTest;
    gem.scene = { physics: { world: { removeCollider: vi.fn() } } };
    return gem;
}

describe("Gem.cleanup", () => {
    it("removes the activate timer and the collider", () => {
        const gem = makeGem();
        gem.activateTimer = { remove: vi.fn() };
        gem.collider = { id: "collider" };

        gem.cleanup();

        expect(gem.activateTimer.remove).toHaveBeenCalledTimes(1);
        expect(gem.scene.physics.world.removeCollider).toHaveBeenCalledWith(gem.collider);
    });

    it("does not throw when the collider was never created", () => {
        const gem = makeGem();
        gem.activateTimer = { remove: vi.fn() };

        expect(() => gem.cleanup()).not.toThrow();
        expect(gem.scene.physics.world.removeCollider).not.toHaveBeenCalled();
    });
});
