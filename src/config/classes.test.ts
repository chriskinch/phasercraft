import { describe, it, expect } from "vitest";
import { matchAscended, getSpellSchools, getAscendedClass, getAscendedSchools } from "./classes";

// Pure config-factory logic for the class/ascended-class/school system. These
// are deterministic table lookups and combinatorics, so they're tested directly
// (no Phaser construction involved).

describe("matchAscended", () => {
    it("treats two arrays as equal regardless of order", () => {
        expect(matchAscended(["warrior", "cleric"], ["cleric", "warrior"])).toBe(true);
    });

    it("returns false for differing members", () => {
        expect(matchAscended(["warrior", "warrior"], ["warrior", "cleric"])).toBe(false);
    });
});

describe("getSpellSchools", () => {
    it("returns the base schools for a base class", () => {
        expect(getSpellSchools("mage")).toEqual(["fire", "frost", "arcane", "earth"]);
        expect(getSpellSchools("warrior")).toEqual(["arcane", "fire"]);
    });

    it("resolves ascended classes through getAscendedSchools", () => {
        // `knight` = warrior + warrior; should equal the ascended-school resolution.
        expect(getSpellSchools("knight")).toEqual(getAscendedSchools("knight"));
    });

    it("throws for an unknown class", () => {
        expect(() => getSpellSchools("dragoon" as never)).toThrow(
            "Error: Not a valid class or ascended class!"
        );
    });
});

describe("getAscendedClass", () => {
    it("maps a pair of base classes to their ascended class (order-independent)", () => {
        expect(getAscendedClass(["cleric", "warrior"])).toBe("paladin");
        expect(getAscendedClass(["warrior", "cleric"])).toBe("paladin");
    });

    it("maps a doubled base class to its pure ascension", () => {
        expect(getAscendedClass(["warrior", "warrior"])).toBe("knight");
        expect(getAscendedClass(["ranger", "ranger"])).toBe("hunter");
    });

    it("returns null when no ascended class matches", () => {
        expect(getAscendedClass(["mage", "warrior", "cleric"] as never)).toBeNull();
    });
});

describe("getAscendedSchools", () => {
    it("returns a sorted, de-duplicated school list", () => {
        const schools = getAscendedSchools("knight");
        // Sorted ascending.
        expect([...schools].sort()).toEqual(schools);
        // No duplicates.
        expect(new Set(schools).size).toBe(schools.length);
    });

    it("includes the primary and secondary base schools", () => {
        // knight = warrior + warrior; warrior's schools are arcane + fire.
        const schools = getAscendedSchools("knight");
        expect(schools).toContain("arcane");
        expect(schools).toContain("fire");
    });

    it("includes ascended-school combinations for mixed parents", () => {
        // paladin = cleric (light, fire) + warrior (arcane, fire).
        // light+arcane => smite, fire+fire => flare, light+fire => holy.
        const schools = getAscendedSchools("paladin");
        expect(schools).toContain("smite");
        expect(schools).toContain("flare");
        expect(schools).toContain("holy");
    });
});
