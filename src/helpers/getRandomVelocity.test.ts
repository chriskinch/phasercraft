import { describe, it, expect, vi, afterEach } from "vitest";
import getRandomVelocity from "./getRandomVelocity";

describe("getRandomVelocity", () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("returns a value whose magnitude is within [min, max]", () => {
        for (let i = 0; i < 50; i++) {
            const v = getRandomVelocity(5, 10);
            expect(Math.abs(v)).toBeGreaterThanOrEqual(5);
            expect(Math.abs(v)).toBeLessThanOrEqual(10);
        }
    });

    it("returns a negative value when Math.random >= 0.5", () => {
        vi.spyOn(Math, "random").mockReturnValue(0.99);
        const v = getRandomVelocity(3, 3);
        expect(v).toBeLessThan(0);
    });

    it("returns a positive value when Math.random < 0.5", () => {
        vi.spyOn(Math, "random").mockReturnValue(0);
        const v = getRandomVelocity(3, 3);
        expect(v).toBeGreaterThan(0);
    });
});
