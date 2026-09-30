import { describe, it, expect, vi } from "vitest";
import AreaEffect from "./AreaEffect";

// Regression test for issue #328. The lifespan timer and both overlap
// colliders outlive a plain destroy(); cleanup() releases them so stale
// colliders don't accumulate over repeated Consecration casts. Constructor-free
// fake on the real prototype.

interface AreaEffectUnderTest {
    lifespanTimer?: { remove: ReturnType<typeof vi.fn> };
    enemyCollider?: { destroy: ReturnType<typeof vi.fn> };
    playerCollider?: { destroy: ReturnType<typeof vi.fn> };
    cleanup(): void;
}

function makeAreaEffect(): AreaEffectUnderTest {
    const effect = Object.create(AreaEffect.prototype) as AreaEffectUnderTest;
    effect.lifespanTimer = { remove: vi.fn() };
    effect.enemyCollider = { destroy: vi.fn() };
    effect.playerCollider = { destroy: vi.fn() };
    return effect;
}

describe("AreaEffect.cleanup", () => {
    it("removes the lifespan timer and both overlap colliders", () => {
        const effect = makeAreaEffect();
        const { lifespanTimer, enemyCollider, playerCollider } = effect;

        effect.cleanup();

        expect(lifespanTimer!.remove).toHaveBeenCalledTimes(1);
        expect(enemyCollider!.destroy).toHaveBeenCalledTimes(1);
        expect(playerCollider!.destroy).toHaveBeenCalledTimes(1);
    });

    it("is idempotent — a second cleanup releases nothing twice", () => {
        const effect = makeAreaEffect();
        const { lifespanTimer, enemyCollider, playerCollider } = effect;

        effect.cleanup();
        expect(() => effect.cleanup()).not.toThrow();

        expect(lifespanTimer!.remove).toHaveBeenCalledTimes(1);
        expect(enemyCollider!.destroy).toHaveBeenCalledTimes(1);
        expect(playerCollider!.destroy).toHaveBeenCalledTimes(1);
    });
});
