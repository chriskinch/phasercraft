import { describe, it, expect } from "vitest";
import { maxCounts, percentile, summarizeFrames } from "./frameStats";
import type { PerfCounts } from "./types";

describe("percentile", () => {
    it("uses nearest rank", () => {
        const sorted = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        expect(percentile(sorted, 50)).toBe(5);
        expect(percentile(sorted, 95)).toBe(10);
        expect(percentile(sorted, 10)).toBe(1);
        expect(percentile(sorted, 0)).toBe(1);
    });

    it("is 0 for no samples", () => {
        expect(percentile([], 95)).toBe(0);
    });
});

describe("summarizeFrames", () => {
    it("summarises unsorted samples and counts budget overruns", () => {
        const summary = summarizeFrames([16, 17, 40, 16, 60]);
        expect(summary).toEqual({
            count: 5,
            mean: 29.8,
            p50: 17,
            p95: 60,
            p99: 60,
            max: 60,
            over16_7: 3,
            over33_3: 2,
            over50: 1,
        });
    });

    it("is all zeros for no samples", () => {
        const summary = summarizeFrames([]);
        expect(summary.count).toBe(0);
        expect(summary.mean).toBe(0);
        expect(summary.max).toBe(0);
    });
});

describe("maxCounts", () => {
    it("takes the field-wise maximum", () => {
        const a: PerfCounts = {
            enemies: 5,
            bodies: 10,
            timers: 3,
            tweens: 0,
            displayList: 20,
            gameObjects: 40,
            graphics: 6,
            texts: 1,
        };
        const b: PerfCounts = { ...a, enemies: 2, timers: 9, texts: 4 };
        expect(maxCounts(a, b)).toEqual({ ...a, timers: 9, texts: 4 });
    });
});
