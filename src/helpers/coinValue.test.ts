import { describe, it, expect } from "vitest";
import coinValue from "./coinValue";

describe("coinValue", () => {
    it("returns the base value when no multiplier is given", () => {
        expect(coinValue(1)).toBe(1);
        expect(coinValue(5)).toBe(5);
    });

    it("scales the base value by the multiplier", () => {
        expect(coinValue(1, 10)).toBe(10);
        expect(coinValue(5, 10)).toBe(50);
    });

    it("rounds fractional multipliers to whole coins", () => {
        expect(coinValue(1, 1.5)).toBe(2);
        expect(coinValue(1, 1.2)).toBe(1);
        expect(coinValue(5, 2.5)).toBe(13);
    });

    it("never drops below the base value", () => {
        expect(coinValue(1, 0)).toBe(1);
        expect(coinValue(5, 0.1)).toBe(5);
    });
});
