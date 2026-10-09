import { describe, it, expect } from "vitest";
import { learnToast, mergeStatus, scrollStacks, scrollStatus } from "./scrollStatus";

const loadout = (...spells: (string | null)[]) =>
    spells as Parameters<typeof scrollStatus>[0]["abilityLoadout"];

describe("scrollStatus", () => {
    const mage = {
        character: "Mage" as const,
        learnedSpells: {},
        abilityLoadout: loadout("Frostbolt", null, null, null, null),
    };

    it("on-class, not learned: readable, learns and fills an empty slot", () => {
        const s = scrollStatus(mage, "Fireball", 1);
        expect(s).toMatchObject({ state: "learn", readable: true });
        expect(s.hint).toBe("Learns Fireball at L1 and fills the first empty slot.");
    });

    it("not learned with a full loadout has no slot clause", () => {
        const full = { ...mage, abilityLoadout: loadout("a", "b", "c", "d", "e") };
        expect(scrollStatus(full, "Fireball", 2).hint).toBe("Learns Fireball at L2.");
    });

    it("on-class, scroll above spell level: readable upgrade", () => {
        const s = scrollStatus({ ...mage, learnedSpells: { Fireball: 1 } }, "Fireball", 2);
        expect(s).toMatchObject({ state: "upgrade", readable: true });
        expect(s.hint).toBe("Upgrades Fireball L1 → L2.");
    });

    it("on-class, scroll at or below spell level: not readable, merge hint", () => {
        const same = scrollStatus({ ...mage, learnedSpells: { Fireball: 2 } }, "Fireball", 2);
        expect(same).toMatchObject({ state: "merge", readable: false });
        expect(same.hint).toBe("Merge 3 at the Arcanum to make L3.");
        const lower = scrollStatus({ ...mage, learnedSpells: { Fireball: 3 } }, "Fireball", 1);
        expect(lower.hint).toBe("Merge 3 at the Arcanum to make L2.");
    });

    it("spell at L3 with an L3 scroll: max level", () => {
        const s = scrollStatus({ ...mage, learnedSpells: { Fireball: 3 } }, "Fireball", 3);
        expect(s).toMatchObject({ state: "max", readable: false });
        expect(s.hint).toBe("Max level — sell or keep for recipes.");
    });

    it("off-class: not readable, names the classes", () => {
        const s = scrollStatus(mage, "Whirlwind", 1);
        expect(s).toMatchObject({ state: "offClass", readable: false });
        expect(s.hint).toBe("Warrior only. Sell it or use it at the Arcanum.");
        expect(scrollStatus({ ...mage, character: "Warrior" }, "Fireball", 1).hint).toBe(
            "Mage, Occultist only. Sell it or use it at the Arcanum."
        );
    });
});

describe("learnToast", () => {
    it("names the slot the new spell is auto-equipped into", () => {
        expect(
            learnToast(
                { learnedSpells: {}, abilityLoadout: loadout("Frostbolt", null, null, null, null) },
                "Fireball",
                1
            )
        ).toBe("Learned Fireball (L1) — equipped in slot 2");
    });

    it("full loadout: no slot clause", () => {
        expect(
            learnToast(
                { learnedSpells: {}, abilityLoadout: loadout("a", "b", "c", "d", "e") },
                "Fireball",
                1
            )
        ).toBe("Learned Fireball (L1)");
    });

    it("reports an upgrade", () => {
        expect(
            learnToast(
                { learnedSpells: { Fireball: 1 }, abilityLoadout: loadout(null) },
                "Fireball",
                3
            )
        ).toBe("Upgraded Fireball to L3");
    });
});

describe("scrollStacks", () => {
    it("lists one stack per spell + level, by name then level, skipping zeros", () => {
        const stacks = scrollStacks({
            Whirlwind: { 1: 2 },
            Fireball: { 3: 1, 1: 4, 2: 0 },
        });
        expect(stacks.map((s) => [s.key, s.count])).toEqual([
            ["Fireball_l1", 4],
            ["Fireball_l3", 1],
            ["Whirlwind_l1", 2],
        ]);
    });
});

describe("mergeStatus", () => {
    it("enables Merge with 3 or more below max level", () => {
        expect(mergeStatus("Fireball", 1, 3)).toEqual({
            state: "merge",
            readable: true,
            hint: "Merges 3 into 1 Fireball L2.",
        });
    });

    it("blocks with fewer than 3 and says how many are held", () => {
        expect(mergeStatus("Fireball", 2, 2)).toEqual({
            state: "merge",
            readable: false,
            hint: "Need 3 to merge into L3 (have 2).",
        });
    });

    it("blocks at max level whatever the count", () => {
        expect(mergeStatus("Fireball", 3, 9)).toMatchObject({ state: "max", readable: false });
    });
});
