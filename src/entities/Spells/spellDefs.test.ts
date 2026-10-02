import { describe, it, expect, vi } from "vitest";
import AssignSpell from "./AssignSpell";
import type Spell from "./Spell";
import { SPELL_DEFS, SPELL_TYPES } from "@/types/game";
import type { SpellOptions, SpellType } from "@/types/game";

// Spell base (a Phaser Sprite) replaced with a plain class at the entity seam, so
// each subclass's constructor defaults land on the instance untouched.
vi.mock("./Spell", () => ({
    default: class {
        constructor(config: Record<string, unknown>) {
            Object.assign(this, config);
        }
        cleanup(): void {}
        // Chainable Sprite setters a few subclass constructors call.
        setScale(): this {
            return this;
        }
        setTint(): this {
            return this;
        }
        setAlpha(): this {
            return this;
        }
    },
}));

// Minimal scene/player stubs for constructors that touch them after super().
const baseConfig = (): SpellOptions =>
    ({
        scene: { events: { on: vi.fn(), once: vi.fn(), off: vi.fn() } },
        player: { x: 0, y: 0, stats: { magic_power: 0 } },
    }) as unknown as SpellOptions;

// Every spell AssignSpell can build — kept literal so a spell missing from the
// registry (or vice versa) fails here, not just at the type level.
const ALL_SPELLS: SpellType[] = [
    "AimedShot",
    "BattleStomp",
    "BloodFurnace",
    "Consecration",
    "EarthShield",
    "Enrage",
    "Enfeeble",
    "Faith",
    "Fireball",
    "Focus",
    "Frostbolt",
    "Heal",
    "Invocation",
    "ManaShield",
    "Multishot",
    "PowerInfusion",
    "SiphonSoul",
    "Smite",
    "SnareTrap",
    "Whirlwind",
];

const build = (type: SpellType): Spell => new AssignSpell(type, baseConfig()) as unknown as Spell;

describe("SPELL_DEFS", () => {
    it("has a def for every SpellType and nothing else", () => {
        expect([...SPELL_TYPES].sort()).toEqual([...ALL_SPELLS].sort());
    });

    it.each(ALL_SPELLS)("%s def is complete", (type) => {
        const def = SPELL_DEFS[type];
        expect(def.name).toBeTruthy();
        expect(def.description).toBeTruthy();
        expect(def.effect).toBeTruthy();
        expect(def.classes.length).toBeGreaterThan(0);
    });

    it("lists Fireball under both Mage and Occultist", () => {
        expect(SPELL_DEFS.Fireball.classes).toEqual(["Mage", "Occultist"]);
    });

    it.each(ALL_SPELLS)("%s instance defaults come from its def", (type) => {
        const def = SPELL_DEFS[type];
        const spell = build(type);
        expect(spell.icon_name).toBe(def.icon_name);
        expect(spell.cooldown).toBe(def.cooldown);
        expect(spell.cost).toEqual(def.cost);
        expect(spell.targetKind).toBe(def.targetKind);
        expect(spell.castRange).toBe(def.castRange);
        if (def.castRange === undefined) expect("castRange" in spell).toBe(false);
    });

    it("gives each instance its own cost object", () => {
        const spell = build("Fireball");
        expect(spell.cost).not.toBe(SPELL_DEFS.Fireball.cost);
    });

    it("still lets caller config override the def", () => {
        const spell = new AssignSpell("Fireball", {
            ...baseConfig(),
            cooldown: 99,
        }) as unknown as Spell;
        expect(spell.cooldown).toBe(99);
    });
});
