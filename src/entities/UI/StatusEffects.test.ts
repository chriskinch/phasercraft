import { describe, it, expect, vi } from "vitest";
import StatusEffects from "./StatusEffects";

// Regression test for issue #328. Effect expiry timers live on the scene clock
// and would otherwise fire calculate() against a destroyed owner. Constructor-
// free fake on the real prototype.

interface StatusEffectsUnderTest {
    timers: Record<string, { remove: ReturnType<typeof vi.fn> }>;
    cleanup(): void;
}

function makeStatusEffects(): StatusEffectsUnderTest {
    const effects = Object.create(StatusEffects.prototype) as StatusEffectsUnderTest;
    effects.timers = { frostbolt: { remove: vi.fn() }, curse: { remove: vi.fn() } };
    return effects;
}

describe("StatusEffects.cleanup", () => {
    it("removes every pending effect timer and clears the map", () => {
        const effects = makeStatusEffects();
        const { frostbolt, curse } = effects.timers;

        effects.cleanup();

        expect(frostbolt.remove).toHaveBeenCalledTimes(1);
        expect(curse.remove).toHaveBeenCalledTimes(1);
        expect(effects.timers).toEqual({});
    });

    it("is idempotent — a second cleanup removes nothing twice", () => {
        const effects = makeStatusEffects();
        const { frostbolt } = effects.timers;

        effects.cleanup();
        effects.cleanup();

        expect(frostbolt.remove).toHaveBeenCalledTimes(1);
    });
});
