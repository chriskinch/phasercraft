import { describe, it, expect, vi } from "vitest";
import Retaliation from "./Retaliation";

interface RetaliationUnderTest {
    duration: number;
    reflect: number;
    timer?: { remove: ReturnType<typeof vi.fn> };
    scene: {
        time: { addEvent: ReturnType<typeof vi.fn> };
        events: { on: ReturnType<typeof vi.fn>; off: ReturnType<typeof vi.fn> };
    };
    player: {
        boons: { addEffect: ReturnType<typeof vi.fn>; contains: ReturnType<typeof vi.fn> };
        hero: { setTint: ReturnType<typeof vi.fn>; clearTint: ReturnType<typeof vi.fn> };
    };
    effect(): void;
    clearEffect(): void;
    cleanup(): void;
    counter(damage: number, attackType?: string, attacker?: unknown): void;
}

function make(): RetaliationUnderTest {
    const spell = Object.create(Retaliation.prototype) as RetaliationUnderTest;
    spell.duration = 5;
    spell.reflect = 0.5;
    spell.scene = {
        time: { addEvent: vi.fn(() => ({ remove: vi.fn() })) },
        events: { on: vi.fn(), off: vi.fn() },
    };
    spell.player = {
        boons: { addEffect: vi.fn(), contains: vi.fn(() => false) },
        hero: { setTint: vi.fn(), clearTint: vi.fn() },
    };
    return spell;
}

const enemy = () => ({ alive: true, hit: vi.fn() });

describe("Retaliation", () => {
    it("adds a boon, tints, listens for damage and schedules expiry", () => {
        const spell = make();
        spell.effect();
        expect(spell.player.boons.addEffect).toHaveBeenCalledWith(spell);
        expect(spell.player.hero.setTint).toHaveBeenCalledWith(0x6699ff);
        expect(spell.scene.events.on).toHaveBeenCalledWith("player:damaged", spell.counter, spell);
        expect(spell.scene.time.addEvent.mock.calls[0][0].delay).toBe(5001);
    });

    it("re-cast does not double-register the listener", () => {
        const spell = make();
        spell.effect();
        spell.effect();
        expect(spell.scene.events.on).toHaveBeenCalledTimes(1);
    });

    it("reflects a share of melee damage at the attacker", () => {
        const spell = make();
        const e = enemy();
        spell.counter(41, "melee", e);
        expect(e.hit).toHaveBeenCalledWith({ power: 21, type: "physical" });
    });

    it("ignores ranged hits and dead attackers", () => {
        const spell = make();
        const e = enemy();
        spell.counter(40, "ranged", e);
        spell.counter(40, "melee", { ...e, alive: false });
        spell.counter(40, "melee", undefined);
        expect(e.hit).not.toHaveBeenCalled();
    });

    it("expiry releases the listener and clears the tint", () => {
        const spell = make();
        spell.effect();
        spell.clearEffect();
        expect(spell.scene.events.off).toHaveBeenCalledWith("player:damaged", spell.counter, spell);
        expect(spell.player.hero.clearTint).toHaveBeenCalledTimes(1);
        expect(spell.timer).toBeUndefined();
    });

    it("cleanup removes timer and listener, idempotently", () => {
        const spell = make();
        spell.effect();
        const timer = spell.timer!;
        const proto = Object.getPrototypeOf(Retaliation.prototype) as { cleanup(): void };
        const superCleanup = vi.spyOn(proto, "cleanup").mockImplementation(() => {});
        spell.cleanup();
        spell.cleanup();
        expect(timer.remove).toHaveBeenCalledTimes(1);
        expect(spell.scene.events.off).toHaveBeenCalledTimes(1);
        superCleanup.mockRestore();
    });
});
