import { describe, it, expect } from "vitest";
import {
    COMPONENT_DEFS,
    SCROLL_DISPEL_COST,
    SPELL_DEFS,
    SPELL_RECIPES,
    specialById,
} from "@/types/game";
import type { SpellType } from "@/types/game";
import { craftStatus, dispelStatus, dispelYield, levelMultiplier, tradeStatus } from "./spellCraft";
import type { CraftContext } from "./spellCraft";

const ctx = (overrides: Partial<CraftContext> = {}): CraftContext => ({
    spellRecipes: [],
    scrolls: {},
    components: [],
    specials: {},
    coins: 0,
    ...overrides,
});

const fireball = SPELL_RECIPES.Fireball;
const stocked = () =>
    (Object.entries(fireball.materials) as [string, number][]).map(([type, n]) => ({
        id: type,
        type: type as "cloth",
        quantity: n,
    }));

describe("SPELL_RECIPES", () => {
    // Every ability needs a recipe (CLAUDE.md → New ability).
    it("has a recipe for every spell", () => {
        expect(Object.keys(SPELL_RECIPES).sort()).toEqual(Object.keys(SPELL_DEFS).sort());
    });

    it.each(Object.keys(SPELL_RECIPES) as SpellType[])("%s recipe is valid", (spell) => {
        const { materials, coins, special } = SPELL_RECIPES[spell];
        expect(Object.keys(materials).length).toBeGreaterThan(0);
        for (const [type, n] of Object.entries(materials)) {
            expect(COMPONENT_DEFS).toHaveProperty(type);
            expect(n).toBeGreaterThan(0);
        }
        expect(coins).toBeGreaterThan(0);
        expect(specialById(special)).toBeDefined();
    });
});

describe("dispelYield", () => {
    it("scales ×3 per level above L1", () => {
        expect([1, 2, 3].map((l) => levelMultiplier(l as 1 | 2 | 3))).toEqual([1, 3, 9]);
        const y = dispelYield("Fireball", 2);
        expect(y.specials).toBe(3);
        expect(y.special).toBe(fireball.special);
        for (const [type, n] of Object.entries(fireball.materials)) {
            expect(y.materials[type as "cloth"]).toBe(n * 3);
        }
    });
});

describe("tradeStatus", () => {
    it("is enabled for a held scroll of an unlearnt recipe", () => {
        const s = tradeStatus(ctx({ scrolls: { Fireball: { 2: 1 } } }), "Fireball", 2);
        expect(s).toEqual({ enabled: true, hint: "Trade to learn the Fireball recipe." });
    });

    it("is disabled when not held or already known", () => {
        expect(tradeStatus(ctx(), "Fireball", 1).hint).toBe("No scroll to trade.");
        const known = ctx({ spellRecipes: ["Fireball"], scrolls: { Fireball: { 1: 1 } } });
        expect(tradeStatus(known, "Fireball", 1)).toEqual({
            enabled: false,
            hint: "Fireball recipe already known.",
        });
    });
});

describe("craftStatus", () => {
    const ready = (overrides: Partial<CraftContext> = {}) =>
        ctx({
            spellRecipes: ["Fireball"],
            components: stocked(),
            specials: { [fireball.special]: 1 },
            coins: fireball.coins,
            ...overrides,
        });

    it("is enabled with everything held", () => {
        expect(craftStatus(ready(), "Fireball")).toEqual({
            enabled: true,
            hint: "Crafts 1 Fireball L1.",
        });
    });

    it("asks for the recipe first", () => {
        expect(craftStatus(ready({ spellRecipes: [] }), "Fireball")).toEqual({
            enabled: false,
            hint: "Trade a Fireball scroll to learn its recipe.",
        });
    });

    it("lists every shortfall, special and coins included", () => {
        const s = craftStatus(ready({ components: [], specials: {}, coins: 0 }), "Fireball");
        expect(s.enabled).toBe(false);
        for (const type of Object.keys(fireball.materials)) {
            expect(s.hint).toContain(COMPONENT_DEFS[type as "cloth"].name);
        }
        expect(s.hint).toContain(`1 ${specialById(fireball.special)?.name}`);
        expect(s.hint).toContain(`${fireball.coins} more coins`);
    });
});

describe("dispelStatus", () => {
    const held = (overrides: Partial<CraftContext> = {}) =>
        ctx({
            spellRecipes: ["Fireball"],
            scrolls: { Fireball: { 1: 1 } },
            coins: SCROLL_DISPEL_COST,
            ...overrides,
        });

    it("is enabled and states the yield and fee", () => {
        const s = dispelStatus(held(), "Fireball", 1);
        expect(s.enabled).toBe(true);
        expect(s.hint).toContain(`1 ${specialById(fireball.special)?.name}`);
        expect(s.hint).toContain(`for ${SCROLL_DISPEL_COST} coins`);
    });

    it("is disabled when not held, not learnt, or short on the fee", () => {
        expect(dispelStatus(held({ scrolls: {} }), "Fireball", 1).enabled).toBe(false);
        expect(dispelStatus(held({ spellRecipes: [] }), "Fireball", 1).hint).toBe(
            "Learn its recipe first (Trade)."
        );
        expect(dispelStatus(held({ coins: 0 }), "Fireball", 1).enabled).toBe(false);
    });
});
