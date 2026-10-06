import { describe, it, expect } from "vitest";
import {
    applyDifficulty,
    difficultyLevel,
    difficultyMultiplier,
    distanceFraction,
    maxSpawnableDistance,
} from "./difficulty";
import type { WalkabilityGrid } from "./walkability";

// A 4x3 grid of 10 px tiles; `open` lists the spawnable tiles as [x, y].
function grid(open: [number, number][]): WalkabilityGrid {
    const spawnable = new Uint8Array(12);
    open.forEach(([x, y]) => (spawnable[y * 4 + x] = 1));
    return { width: 4, height: 3, tileWidth: 10, tileHeight: 10, spawnable };
}

describe("maxSpawnableDistance", () => {
    it("measures to the centre of the furthest spawnable tile", () => {
        const start = { x: 5, y: 5 };
        // Tile (3, 2)'s centre is (35, 25): 30 across, 20 down.
        expect(
            maxSpawnableDistance(
                grid([
                    [0, 0],
                    [1, 0],
                    [3, 2],
                ]),
                start
            )
        ).toBeCloseTo(Math.hypot(30, 20));
    });

    it("ignores tiles that are not spawnable", () => {
        expect(maxSpawnableDistance(grid([[1, 0]]), { x: 5, y: 5 })).toBeCloseTo(10);
    });

    it("is 0 for a map with nowhere to spawn", () => {
        expect(maxSpawnableDistance(grid([]), { x: 5, y: 5 })).toBe(0);
    });
});

describe("distanceFraction", () => {
    const start = { x: 100, y: 100 };

    it("runs from 0 at the start to 1 at the max distance", () => {
        expect(distanceFraction(start, start, 1000)).toBe(0);
        expect(distanceFraction({ x: 600, y: 100 }, start, 1000)).toBeCloseTo(0.5);
        expect(distanceFraction({ x: 100, y: 1100 }, start, 1000)).toBeCloseTo(1);
    });

    it("clamps beyond the max, and is 0 with no max", () => {
        expect(distanceFraction({ x: 5000, y: 100 }, start, 1000)).toBe(1);
        expect(distanceFraction({ x: 5000, y: 100 }, start, 0)).toBe(0);
    });
});

describe("difficultyMultiplier", () => {
    it.each([
        // biome, fraction, expected (max multiplier 3)
        [1, 0, 1],
        [1, 1, 3],
        [1, 0.5, 2],
        [1.5, 0, 1.5],
        [1.5, 1, 4.5],
        [2, 0, 2],
        [2, 1, 6],
    ])("biome %s at %s of the way out is %s", (biome, fraction, expected) => {
        expect(difficultyMultiplier(biome, fraction, 3)).toBeCloseTo(expected);
    });
});

describe("difficultyLevel", () => {
    it("is the multiplier × 5, rounded: forest start 5 to tundra edge 30", () => {
        expect(difficultyLevel(1)).toBe(5);
        expect(difficultyLevel(1.5)).toBe(8);
        expect(difficultyLevel(2.34)).toBe(12);
        expect(difficultyLevel(6)).toBe(30);
    });
});

describe("applyDifficulty", () => {
    const stats = { damage: 60, health_max: 100, speed: 50, attack_speed: 0.98 };

    it("scales health and damage only, to whole points", () => {
        expect(applyDifficulty(stats, 2.5)).toEqual({
            damage: 150,
            health_max: 250,
            speed: 50,
            attack_speed: 0.98,
        });
        expect(applyDifficulty({ ...stats, damage: 25 }, 1.5).damage).toBe(38);
    });

    it("leaves stats unchanged at 1", () => {
        expect(applyDifficulty(stats, 1)).toEqual(stats);
    });
});
