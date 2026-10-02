import { describe, it, expect } from "vitest";
import { installRandomHook, installSeededRandom, mulberry32 } from "./rng";

// Own file: the hook replaces Math.random for the rest of the module.
describe("installRandomHook", () => {
    it("seeds callers that captured Math.random before seeding", () => {
        installRandomHook();
        const captured = Math.random;

        const restore = installSeededRandom(5);
        const expected = mulberry32(5);
        expect([captured(), captured(), captured()]).toEqual([expected(), expected(), expected()]);
        restore();

        const value = captured();
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThan(1);
    });
});
