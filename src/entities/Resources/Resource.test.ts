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

    it("does not throw when there is no regen timer", () => {
        const resource = makeResource();
        (resource as { tick?: unknown }).tick = undefined;
        resource.subscriptions = [vi.fn()];

        expect(() => resource.cleanup()).not.toThrow();
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

// Regen/adjust flow (issue #309). setValue is the clamp + redraw + emit core
// that adjustValue/regenerate funnel through. We exercise the real prototype
// methods against a constructor-free fake stubbing only the seams they touch:
// this.stats, the "current" graphics bar (its scaleX is written), and emit().
interface ResourceStatsUnderTest {
    max: number;
    value: number;
    regen_rate: number;
    regen_value: number;
    missing?: number;
}

interface ResourceFlowUnderTest {
    stats: ResourceStatsUnderTest;
    graphics: { current: { scaleX: number } };
    emit: ReturnType<typeof vi.fn>;
    setValue(new_value: number): void;
    adjustValue(adj: number): void;
    getValue(): number;
    resourcePercent(): number;
    regenerate(): void;
    doTick(): void;
}

function makeFlowResource(stats: Partial<ResourceStatsUnderTest> = {}): ResourceFlowUnderTest {
    const resource = Object.create(Resource.prototype) as ResourceFlowUnderTest;
    resource.stats = {
        max: 100,
        value: 50,
        regen_rate: 1,
        regen_value: 10,
        ...stats,
    };
    resource.graphics = { current: { scaleX: 0 } };
    resource.emit = vi.fn();
    return resource;
}

describe("Resource.setValue", () => {
    it("sets the value within range and ceils fractional input", () => {
        const resource = makeFlowResource({ value: 50 });

        resource.setValue(60.2);

        expect(resource.stats.value).toBe(61);
    });

    it("clamps above max down to max", () => {
        const resource = makeFlowResource({ max: 100, value: 50 });

        resource.setValue(150);

        expect(resource.stats.value).toBe(100);
    });

    it("clamps below zero up to zero", () => {
        const resource = makeFlowResource({ value: 50 });

        resource.setValue(-30);

        expect(resource.stats.value).toBe(0);
    });

    it("updates the current bar scale to the resource percent", () => {
        const resource = makeFlowResource({ max: 200, value: 0 });

        resource.setValue(50);

        expect(resource.graphics.current.scaleX).toBe(0.25);
    });

    it("recomputes the missing amount and emits change", () => {
        const resource = makeFlowResource({ max: 100, value: 50 });

        resource.setValue(80);

        expect(resource.stats.missing).toBe(20);
        expect(resource.emit).toHaveBeenCalledTimes(1);
        expect(resource.emit).toHaveBeenCalledWith("change", resource);
    });
});

describe("Resource.adjustValue", () => {
    it("adds a positive delta to the current value", () => {
        const resource = makeFlowResource({ value: 50 });

        resource.adjustValue(25);

        expect(resource.stats.value).toBe(75);
    });

    it("subtracts a negative delta from the current value", () => {
        const resource = makeFlowResource({ value: 50 });

        resource.adjustValue(-20);

        expect(resource.stats.value).toBe(30);
    });

    it("clamps when the delta would overshoot max", () => {
        const resource = makeFlowResource({ max: 100, value: 95 });

        resource.adjustValue(20);

        expect(resource.stats.value).toBe(100);
    });

    it("clamps when the delta would drop below zero", () => {
        const resource = makeFlowResource({ value: 5 });

        resource.adjustValue(-20);

        expect(resource.stats.value).toBe(0);
    });
});

describe("Resource.getValue / resourcePercent", () => {
    it("returns the current value", () => {
        const resource = makeFlowResource({ value: 42 });

        expect(resource.getValue()).toBe(42);
    });

    it("computes value over max as a percent", () => {
        const resource = makeFlowResource({ max: 80, value: 20 });

        expect(resource.resourcePercent()).toBe(0.25);
    });

    it("returns 0 percent when the value is not above zero", () => {
        const resource = makeFlowResource({ max: 80, value: 0 });

        expect(resource.resourcePercent()).toBe(0);
    });
});

describe("Resource.regenerate", () => {
    it("adds regen_value when below max and regen_rate is positive", () => {
        const resource = makeFlowResource({
            max: 100,
            value: 50,
            regen_rate: 1,
            regen_value: 10,
        });

        resource.regenerate();

        expect(resource.stats.value).toBe(60);
    });

    it("does nothing when already at max", () => {
        const resource = makeFlowResource({
            max: 100,
            value: 100,
            regen_rate: 1,
            regen_value: 10,
        });

        resource.regenerate();

        expect(resource.stats.value).toBe(100);
        expect(resource.emit).not.toHaveBeenCalled();
    });

    it("does nothing when regen_rate is zero (non-regenerating resource)", () => {
        const resource = makeFlowResource({
            max: 100,
            value: 50,
            regen_rate: 0,
            regen_value: 10,
        });

        resource.regenerate();

        expect(resource.stats.value).toBe(50);
        expect(resource.emit).not.toHaveBeenCalled();
    });

    it("never overshoots max on a regen tick", () => {
        const resource = makeFlowResource({
            max: 100,
            value: 95,
            regen_rate: 1,
            regen_value: 10,
        });

        resource.regenerate();

        expect(resource.stats.value).toBe(100);
    });

    it("doTick drives a regenerate cycle", () => {
        const resource = makeFlowResource({
            max: 100,
            value: 50,
            regen_rate: 1,
            regen_value: 10,
        });

        resource.doTick();

        expect(resource.stats.value).toBe(60);
    });
});
