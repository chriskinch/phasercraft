import { describe, it, expect } from "vitest";
import { installSeededRandom, mulberry32 } from "./rng";

describe("mulberry32", () => {
    it("repeats for the same seed and differs across seeds", () => {
        const a = mulberry32(42);
        const b = mulberry32(42);
        const c = mulberry32(43);
        const run = (rng: () => number) => Array.from({ length: 5 }, rng);
        const first = run(a);
        expect(run(b)).toEqual(first);
        expect(run(c)).not.toEqual(first);
    });

    it("stays in [0, 1)", () => {
        const rng = mulberry32(1);
        for (let i = 0; i < 1000; i++) {
            const value = rng();
            expect(value).toBeGreaterThanOrEqual(0);
            expect(value).toBeLessThan(1);
        }
    });
});

describe("installSeededRandom", () => {
    it("seeds Math.random and restores the original", () => {
        const original = Math.random;
        const restore = installSeededRandom(7);
        const seeded = [Math.random(), Math.random()];
        restore();
        expect(Math.random).toBe(original);

        const again = installSeededRandom(7);
        expect([Math.random(), Math.random()]).toEqual(seeded);
        again();
    });
});
