import { describe, it, expect, vi } from "vitest";
import Focus from "./Focus";

// Constructor-free fake against the real prototype (no Phaser boot), matching
// the other Spell lifecycle tests.
interface FocusUnderTest {
    duration: number;
    value: Focus["value"];
    timer?: { remove: ReturnType<typeof vi.fn> };
    scene: { time: { addEvent: ReturnType<typeof vi.fn> } };
    player: {
        boons: { addEffect: ReturnType<typeof vi.fn>; contains: ReturnType<typeof vi.fn> };
        hero: { setTint: ReturnType<typeof vi.fn>; clearTint: ReturnType<typeof vi.fn> };
    };
    effect(): void;
    clearEffect(): void;
}

function makeFocus(): FocusUnderTest {
    const spell = Object.create(Focus.prototype) as FocusUnderTest;
    spell.duration = 6;
    spell.value = {
        critical_chance: 15,
        attack_speed: (bs: number) => bs * -0.25,
    };
    spell.scene = { time: { addEvent: vi.fn(() => ({ remove: vi.fn() })) } };
    spell.player = {
        boons: { addEffect: vi.fn(), contains: vi.fn(() => false) },
        hero: { setTint: vi.fn(), clearTint: vi.fn() },
    };
    return spell;
}

describe("Focus", () => {
    it("adds itself as a boon, tints the hero and schedules expiry after duration", () => {
        const spell = makeFocus();

        spell.effect();

        expect(spell.player.boons.addEffect).toHaveBeenCalledWith(spell);
        expect(spell.player.hero.setTint).toHaveBeenCalledTimes(1);
        const cfg = spell.scene.time.addEvent.mock.calls[0][0];
        expect(cfg.delay).toBe(6001);
        expect(cfg.callback).toBe(spell.clearEffect);
        expect(spell.timer).toBeDefined();
    });

    it("grants +crit and a shorter (faster) attack interval", () => {
        const spell = makeFocus();
        expect(spell.value.critical_chance).toBe(15);
        expect(spell.value.attack_speed(0.9)).toBeCloseTo(-0.225);
    });

    it("clears the tint on expiry once the boon is gone", () => {
        const spell = makeFocus();
        spell.effect();

        spell.clearEffect();

        expect(spell.player.hero.clearTint).toHaveBeenCalledTimes(1);
        expect(spell.timer).toBeUndefined();
    });

    it("keeps the tint if the boon was re-applied", () => {
        const spell = makeFocus();
        spell.player.boons.contains.mockReturnValue(true);

        spell.clearEffect();

        expect(spell.player.hero.clearTint).not.toHaveBeenCalled();
    });

    it("cleanup removes a pending timer and is idempotent", () => {
        const spell = makeFocus();
        spell.effect();
        const timer = spell.timer!;
        // Bypass Spell.cleanup (needs a full scene); assert Focus's own release.
        const proto = Object.getPrototypeOf(Focus.prototype) as { cleanup(): void };
        const superCleanup = vi.spyOn(proto, "cleanup").mockImplementation(() => {});

        (spell as unknown as Focus).cleanup();
        (spell as unknown as Focus).cleanup();

        expect(timer.remove).toHaveBeenCalledTimes(1);
        expect(spell.timer).toBeUndefined();
        superCleanup.mockRestore();
    });
});
