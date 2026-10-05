import { describe, it, expect, vi } from "vitest";
import { levelFactor, levelSummary, scaleEffect } from "./levelScaling";
import { SPELL_ASPECTS, SPELL_DEFS, SPELL_LEVEL_POWER } from "@/types/game";
import type { SpellType } from "@/types/game";
import Enrage from "@entities/Spells/Enrage";

// Enrage is given test curves (none ship yet) to exercise multi-aspect scaling.
vi.mock("@/types/game", async (importOriginal) => {
    const actual = await importOriginal<typeof import("@/types/game")>();
    return {
        ...actual,
        SPELL_DEFS: {
            ...actual.SPELL_DEFS,
            Enrage: {
                ...actual.SPELL_DEFS.Enrage,
                scaling: {
                    duration: { 1: 1, 2: 1.2, 3: 1.4 },
                    critical_chance: { 1: 1, 2: 1.5, 3: 2 },
                    attack_power: { 1: 1, 2: 2, 3: 3 },
                },
            },
        },
    };
});

describe("levelFactor", () => {
    it("reads the aspect's curve at the level", () => {
        expect(levelFactor("Fireball", "power", 2)).toBe(SPELL_LEVEL_POWER[2]);
        expect(levelFactor("Enrage", "duration", 3)).toBe(1.4);
    });

    it("is 1 for an unscaled aspect, an unscaled spell or no spell", () => {
        expect(levelFactor("Fireball", "duration", 3)).toBe(1);
        expect(levelFactor("Focus", "duration", 3)).toBe(1);
        expect(levelFactor(undefined, "power", 3)).toBe(1);
    });
});

describe("scaleEffect", () => {
    const base = {
        critical_chance: 10,
        attack_power: (bs: number) => bs * 0.2,
        health_regen_rate: -0.25,
    };

    it("scales each stat by its own curve: flat values and functions alike", () => {
        const scaled = scaleEffect("Enrage", base, 2);
        expect(scaled.critical_chance).toBe(15);
        expect(scaled.attack_power(100)).toBeCloseTo(40);
        // No curve → the same entry.
        expect(scaled.health_regen_rate).toBe(-0.25);
    });

    it("is the base at L1 and never mutates it", () => {
        const scaled = scaleEffect("Enrage", base, 1);
        expect(scaled).toEqual(base);
        scaleEffect("Enrage", base, 3);
        expect(base.critical_chance).toBe(10);
    });
});

describe("levelSummary", () => {
    it("lists every aspect that differs from L1", () => {
        expect(levelSummary("Fireball", 2)).toBe("135% power");
        expect(levelSummary("Enrage", 3)).toBe(
            "140% duration, 200% critical chance, 300% attack power"
        );
    });

    it("is empty for a spell with no scaling", () => {
        expect(levelSummary("Focus", 2)).toBe("");
    });
});

describe("SPELL_DEFS scaling", () => {
    it("only uses aspects the spell wires up", () => {
        for (const spell of Object.keys(SPELL_DEFS) as SpellType[]) {
            for (const aspect of Object.keys(SPELL_DEFS[spell].scaling ?? {})) {
                expect(SPELL_ASPECTS[spell]).toContain(aspect);
            }
        }
    });
});

describe("Spell.setLevel → applyLevel (Enrage)", () => {
    it("re-derives duration and stat modifiers from the L1 bases, without compounding", () => {
        const spell = Object.create(Enrage.prototype) as Enrage;
        Object.assign(spell, {
            spellType: "Enrage",
            level: 1,
            baseDuration: 5,
            baseValue: {
                critical_chance: 10,
                attack_power: (bs: number) => bs * 0.2,
                health_regen_value: (bs: number) => bs,
                health_regen_rate: -0.25,
            },
        });

        spell.setLevel(3);
        spell.setLevel(2);

        expect(spell.duration).toBeCloseTo(6);
        expect(spell.value.critical_chance).toBe(15);
        expect(spell.value.attack_power(100)).toBeCloseTo(40);
        expect(spell.value.health_regen_rate).toBe(-0.25);
    });
});
