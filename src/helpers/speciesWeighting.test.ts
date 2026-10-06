import { describe, it, expect } from "vitest";
import enemyTypes from "@config/enemies.json";
import type { EnemyConfig } from "@/types/game";
import { speciesWeights, strongestOverWeakest, weightedPick } from "./speciesWeighting";

describe("tier", () => {
    it("is set on every creature", () => {
        Object.entries(enemyTypes).forEach(([id, enemy]) => {
            expect((enemy as EnemyConfig).tier, id).toBeGreaterThanOrEqual(1);
        });
    });

    it("ships baby-ghoul/imp 1, skeleton/ghoul 2, egbert 3, satyr 4, slime 5", () => {
        const tier = (id: keyof typeof enemyTypes) => (enemyTypes[id] as EnemyConfig).tier;
        expect([tier("baby-ghoul"), tier("imp")]).toEqual([1, 1]);
        expect([tier("skeleton"), tier("ghoul")]).toEqual([2, 2]);
        expect([tier("egbert"), tier("satyr"), tier("slime")]).toEqual([3, 4, 5]);
    });
});

describe("strongestOverWeakest", () => {
    it("is 1/2 at the start, even half-way out, 3 at the far edge", () => {
        expect(strongestOverWeakest(0)).toBeCloseTo(0.5);
        expect(strongestOverWeakest(0.5)).toBeCloseTo(1);
        expect(strongestOverWeakest(1)).toBeCloseTo(3);
    });

    it("clamps outside 0-1", () => {
        expect(strongestOverWeakest(-1)).toBeCloseTo(0.5);
        expect(strongestOverWeakest(2)).toBeCloseTo(3);
    });
});

describe("speciesWeights", () => {
    // The tundra's pool: satyr 4, egbert 3, slime 5.
    const tundra = [4, 3, 5];

    it("makes the weakest 2× likelier than the strongest at the start", () => {
        const [satyr, egbert, slime] = speciesWeights(tundra, 0);
        expect(egbert / slime).toBeCloseTo(2);
        expect(satyr).toBeGreaterThan(slime);
        expect(satyr).toBeLessThan(egbert);
    });

    it("is even half-way out", () => {
        speciesWeights(tundra, 0.5).forEach((w) => expect(w).toBeCloseTo(1));
    });

    it("makes the strongest 3× likelier than the weakest at the far edge", () => {
        const [, egbert, slime] = speciesWeights(tundra, 1);
        expect(slime / egbert).toBeCloseTo(3);
    });

    it("weighs a pool of one tier evenly anywhere", () => {
        expect(speciesWeights([2, 2], 0)).toEqual([1, 1]);
        expect(speciesWeights([2, 2], 1)).toEqual([1, 1]);
    });
});

describe("weightedPick", () => {
    it("splits [0, 1) in proportion to the weights", () => {
        const items = ["a", "b", "c"];
        const weights = [1, 2, 1];
        expect(weightedPick(items, weights, () => 0)).toBe("a");
        expect(weightedPick(items, weights, () => 0.2499)).toBe("a");
        expect(weightedPick(items, weights, () => 0.25)).toBe("b");
        expect(weightedPick(items, weights, () => 0.7499)).toBe("b");
        expect(weightedPick(items, weights, () => 0.75)).toBe("c");
        expect(weightedPick(items, weights, () => 0.9999)).toBe("c");
    });
});
