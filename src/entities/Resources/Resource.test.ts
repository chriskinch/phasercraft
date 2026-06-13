import { describe, it, expect, vi } from "vitest";
import Resource from "./Resource";

// Regression tests for the Phase 2 Resource lifecycle fix (issue #307):
// Resource registered RxJS/store subscriptions (player resources) and a
// scene.time regen timer that were never released, leaking listeners and a
// timer firing against a destroyed sprite. cleanup() now tears both down.
// Tested against the real prototype with a constructor-free fake — no Phaser
// boot — matching the HUD lifecycle tests.

interface ResourceUnderTest {
    subscriptions: Array<ReturnType<typeof vi.fn>>;
    tick: { remove: ReturnType<typeof vi.fn> };
    cleanup(): void;
}

function makeResource(): ResourceUnderTest {
    const resource = Object.create(Resource.prototype) as ResourceUnderTest;
    resource.subscriptions = [];
    resource.tick = { remove: vi.fn() };
    return resource;
}

describe("Resource.cleanup", () => {
    it("unsubscribes every store subscription and clears the list", () => {
        const resource = makeResource();
        const unsubscribeA = vi.fn();
        const unsubscribeB = vi.fn();
        resource.subscriptions = [unsubscribeA, unsubscribeB];

        resource.cleanup();

        expect(unsubscribeA).toHaveBeenCalledTimes(1);
        expect(unsubscribeB).toHaveBeenCalledTimes(1);
        expect(resource.subscriptions).toEqual([]);
    });

    it("removes the regeneration timer", () => {
        const resource = makeResource();

        resource.cleanup();

        expect(resource.tick.remove).toHaveBeenCalledTimes(1);
    });

    it("is idempotent: a second call does not unsubscribe again", () => {
        const resource = makeResource();
        const unsubscribe = vi.fn();
        resource.subscriptions = [unsubscribe];

        resource.cleanup();
        resource.cleanup();

        expect(unsubscribe).toHaveBeenCalledTimes(1);
    });
});
