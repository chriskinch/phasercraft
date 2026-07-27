import { describe, it, expect } from "vitest";
import { BIOMES, BIOME_IDS, DEFAULT_BIOME, isBiomeId } from "./biomes";
import enemyTypes from "./enemies.json";

describe("BIOMES", () => {
    it("defines forest, desert and tundra", () => {
        expect(BIOME_IDS).toEqual(["forest", "desert", "tundra"]);
    });

    it("keys every entry by its own id", () => {
        BIOME_IDS.forEach((id) => expect(BIOMES[id].id).toBe(id));
    });

    it("only lists creatures that exist in enemies.json", () => {
        // A typo here would spawn `undefined` at runtime rather than failing loudly.
        BIOME_IDS.forEach((id) => {
            BIOMES[id].enemies.forEach((enemy) => {
                expect(enemyTypes).toHaveProperty(enemy);
            });
        });
    });

    it("gives every biome a non-empty pool and a workable cap", () => {
        BIOME_IDS.forEach((id) => {
            const biome = BIOMES[id];
            expect(biome.enemies.length).toBeGreaterThan(0);
            expect(biome.total).toBeGreaterThan(0);
            expect(biome.liveCap).toBeGreaterThan(0);
            // A cap above the total would just mean "spawn everything at once".
            expect(biome.liveCap).toBeLessThanOrEqual(biome.total);
        });
    });

    it("gives each biome a distinct background colour", () => {
        const colours = BIOME_IDS.map((id) => BIOMES[id].backgroundColor);
        expect(new Set(colours).size).toBe(colours.length);
        colours.forEach((colour) => expect(colour).toMatch(/^#[0-9a-f]{6}$/i));
    });

    it("has a default that is a real biome", () => {
        expect(BIOMES[DEFAULT_BIOME]).toBeDefined();
    });
});

describe("isBiomeId", () => {
    it("accepts every defined biome id", () => {
        BIOME_IDS.forEach((id) => expect(isBiomeId(id)).toBe(true));
    });

    it("rejects anything else", () => {
        [undefined, null, "", "town", "swamp", 3, {}].forEach((value) => {
            expect(isBiomeId(value)).toBe(false);
        });
    });
});
