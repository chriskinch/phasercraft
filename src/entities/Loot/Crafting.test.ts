import { describe, it, expect, vi } from "vitest";
import Crafting from "./Crafting";

// Crafting-component lifecycle: the activate timer and the player collider
// outlive a plain destroy, so cleanup() (wired to DESTROY) releases both.
// Constructor-free fake on the real prototype, per the lifecycle-test convention.

interface CraftingUnderTest {
    activateTimer?: { remove: ReturnType<typeof vi.fn> };
    collider?: object;
    scene: { physics: { world: { removeCollider: ReturnType<typeof vi.fn> } } };
    cleanup(): void;
}

function makeCrafting(): CraftingUnderTest {
    const crafting = Object.create(Crafting.prototype) as CraftingUnderTest;
    crafting.scene = { physics: { world: { removeCollider: vi.fn() } } };
    return crafting;
}

describe("Crafting.cleanup", () => {
    it("removes the activate timer and the collider", () => {
        const crafting = makeCrafting();
        const timer = { remove: vi.fn() };
        const collider = { id: "collider" };
        crafting.activateTimer = timer;
        crafting.collider = collider;

        crafting.cleanup();

        expect(timer.remove).toHaveBeenCalledTimes(1);
        expect(crafting.scene.physics.world.removeCollider).toHaveBeenCalledWith(collider);
    });

    it("is idempotent: a repeat call releases nothing twice", () => {
        const crafting = makeCrafting();
        const timer = { remove: vi.fn() };
        crafting.activateTimer = timer;
        crafting.collider = { id: "collider" };

        crafting.cleanup();
        crafting.cleanup();

        expect(timer.remove).toHaveBeenCalledTimes(1);
        expect(crafting.scene.physics.world.removeCollider).toHaveBeenCalledTimes(1);
    });

    it("does not throw when the collider was never created", () => {
        const crafting = makeCrafting();
        crafting.activateTimer = { remove: vi.fn() };

        expect(() => crafting.cleanup()).not.toThrow();
        expect(crafting.scene.physics.world.removeCollider).not.toHaveBeenCalled();
    });
});
