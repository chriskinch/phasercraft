import { describe, it, expect, vi } from "vitest";
import Invocation from "./Invocation";

// clearEffect is the channel teardown. It runs when the channel ends naturally
// (Invocation's own timer) and when the CastingController breaks the channel
// early via interruptChannel. Both must fully release the effect: cancel the
// pending natural-end timer and remove the regen boon (which carries its own
// duration timer and would otherwise run to full duration after the channel is
// gone), then restore the player. Exercised against the real prototype with a
// constructor-free fake — no Phaser boot — matching the other lifecycle tests.

interface InvocationUnderTest {
    timer?: { remove: ReturnType<typeof vi.fn> };
    player: {
        boons: { removeEffect: ReturnType<typeof vi.fn> };
        idle: ReturnType<typeof vi.fn>;
        hero: { clearTint: ReturnType<typeof vi.fn> };
        body: { setMaxVelocity: ReturnType<typeof vi.fn> };
    };
    clearEffect(): void;
    interruptChannel(): void;
}

function makeInvocation(): InvocationUnderTest {
    const spell = Object.create(Invocation.prototype) as InvocationUnderTest;
    spell.timer = { remove: vi.fn() };
    spell.player = {
        boons: { removeEffect: vi.fn() },
        idle: vi.fn(),
        hero: { clearTint: vi.fn() },
        body: { setMaxVelocity: vi.fn() },
    };
    return spell;
}

describe("Invocation.clearEffect", () => {
    it("cancels the pending natural-end timer", () => {
        const spell = makeInvocation();

        spell.clearEffect();

        expect(spell.timer!.remove).toHaveBeenCalledTimes(1);
    });

    it("removes the regen boon so the effect never outlives the channel", () => {
        const spell = makeInvocation();

        spell.clearEffect();

        expect(spell.player.boons.removeEffect).toHaveBeenCalledWith(spell);
    });

    it("restores the player (idle, clears the tint, resets max velocity)", () => {
        const spell = makeInvocation();

        spell.clearEffect();

        expect(spell.player.idle).toHaveBeenCalledTimes(1);
        expect(spell.player.hero.clearTint).toHaveBeenCalledTimes(1);
        expect(spell.player.body.setMaxVelocity).toHaveBeenCalledWith(10000);
    });

    // The early-break path and the natural-end timer can both reach clearEffect
    // for one cast, so it must be safe to run twice.
    it("is idempotent — a second call does not throw", () => {
        const spell = makeInvocation();

        spell.clearEffect();

        expect(() => spell.clearEffect()).not.toThrow();
        expect(spell.player.boons.removeEffect).toHaveBeenCalledTimes(2);
    });

    // The guard means a fake without a timer (never cast) tears down cleanly.
    it("does not throw when no timer was scheduled", () => {
        const spell = makeInvocation();
        spell.timer = undefined;

        expect(() => spell.clearEffect()).not.toThrow();
        expect(spell.player.boons.removeEffect).toHaveBeenCalledWith(spell);
    });
});

describe("Invocation.interruptChannel", () => {
    it("ends the effect by delegating to clearEffect", () => {
        const spell = makeInvocation();
        const clearEffect = vi.spyOn(
            Invocation.prototype as unknown as { clearEffect: () => void },
            "clearEffect"
        );

        spell.interruptChannel();

        expect(clearEffect).toHaveBeenCalledTimes(1);
        clearEffect.mockRestore();
    });
});
