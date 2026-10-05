import { describe, it, expect } from "vitest";
import enemyTypes from "@config/enemies.json";
import { rangedCirclingRadius } from "./Ranged";

// Ranged enemies back away inside their circling radius; if that radius is at
// or beyond their attack range they hover out of reach and never fire (the
// regression after imp range dropped 200 → 120 with circling still at 170).

describe("rangedCirclingRadius", () => {
    it("keeps the circling radius inside the attack range", () => {
        for (const range of [40, 120, 200, 500]) {
            expect(rangedCirclingRadius(range)).toBeLessThan(range);
            expect(rangedCirclingRadius(range)).toBeGreaterThan(0);
        }
    });

    it("tracks attack range for every Ranged enemy in enemies.json", () => {
        const ranged = Object.entries(enemyTypes).filter(([, e]) => e.type === "Ranged");
        expect(ranged.length).toBeGreaterThan(0);
        for (const [, e] of ranged) {
            expect(rangedCirclingRadius(e.range)).toBeLessThan(e.range);
        }
    });
});
