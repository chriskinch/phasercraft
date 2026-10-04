import { describe, it, expect, vi, afterEach } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import { SPELL_TYPES } from "@/types/game";
import type { SpellType } from "@/types/game";
import { scrollFrameKey, type ScrollAtlasJson } from "@helpers/scrollSprites";
import { SCROLL_DROP_LEVEL, SCROLL_DROP_WEIGHTS, rollScrollSpell } from "./scrollDrops";

// The scroll loot table must keep up with the spell roster: a spell missing from
// SCROLL_DROP_WEIGHTS can never drop, so adding a spell without adding it here
// fails this suite (and typecheck, via the Record).

const ROOT = path.resolve(__dirname, "../..");

const POOL = Object.keys(SCROLL_DROP_WEIGHTS).sort();

const ATLAS = JSON.parse(
    readFileSync(path.join(ROOT, "public/graphics/atlas/scrolls.json"), "utf8")
) as ScrollAtlasJson;

// Spell ids in AssignSpell's class map — every spell the game can build. Read
// from source, as scrollSprites.test.ts does, so no Phaser is loaded.
const registeredSpells = (): string[] => {
    const src = readFileSync(path.join(ROOT, "src/entities/Spells/AssignSpell.ts"), "utf8");
    const block = /const classes = \{([^}]*)\}/.exec(src)?.[1] ?? "";
    return block
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .sort();
};

// Each spell's share of the [0, 1) roll range, in pool order.
const bands = () => {
    const entries = Object.entries(SCROLL_DROP_WEIGHTS) as [SpellType, number][];
    const total = entries.reduce((sum, [, weight]) => sum + weight, 0);
    let from = 0;
    return entries.map(([spell, weight]) => {
        const band = { spell, from: from / total, to: (from + weight) / total };
        from += weight;
        return band;
    });
};

describe("scroll loot table", () => {
    it("has every spell in SPELL_DEFS, and nothing else", () => {
        expect(POOL).toEqual([...SPELL_TYPES].sort());
    });

    it("has every spell class registered in AssignSpell", () => {
        expect(registeredSpells().length).toBeGreaterThan(0);
        expect(POOL).toEqual(registeredSpells());
    });

    it.each(SPELL_TYPES)("gives %s a positive drop weight", (spell) => {
        const weight = SCROLL_DROP_WEIGHTS[spell];
        expect(Number.isFinite(weight)).toBe(true);
        expect(weight).toBeGreaterThan(0);
    });

    it.each(SPELL_TYPES)("can roll %s", (spell) => {
        const { from, to } = bands().find((band) => band.spell === spell)!;
        expect(to).toBeGreaterThan(from);
        expect(rollScrollSpell((from + to) / 2)).toBe(spell);
    });

    it.each(SPELL_TYPES)("has a drop-level atlas frame for %s", (spell) => {
        expect(ATLAS.frames[scrollFrameKey(spell, SCROLL_DROP_LEVEL)]).toBeDefined();
    });
});

describe("rollScrollSpell", () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("gives each spell the share of the roll range its weight earns", () => {
        for (const { spell, from, to } of bands()) {
            expect(rollScrollSpell(from + 1e-9)).toBe(spell);
            expect(rollScrollSpell(to - 1e-9)).toBe(spell);
        }
    });

    it("stays in the pool at the very ends of the range", () => {
        const all = bands();
        expect(rollScrollSpell(0)).toBe(all[0].spell);
        expect(rollScrollSpell(1 - Number.EPSILON)).toBe(all[all.length - 1].spell);
    });

    it("rolls Math.random by default", () => {
        vi.spyOn(Math, "random").mockReturnValue(0);
        expect(rollScrollSpell()).toBe(bands()[0].spell);
        expect(Math.random).toHaveBeenCalledTimes(1);
    });
});
