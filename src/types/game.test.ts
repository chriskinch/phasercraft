import { describe, it, expect } from "vitest";
import {
    COMPONENT_DEFS,
    COMPONENT_TYPES,
    MERCHANT_RESTOCK_MS,
    MERCHANT_MAX_STOCK,
    merchantWindow,
    merchantRestockRemaining,
    merchantPartsBase,
} from "./game";

describe("component defs", () => {
    it("gives every component type a non-empty tooltip description", () => {
        for (const type of COMPONENT_TYPES) {
            expect(COMPONENT_DEFS[type].description.length).toBeGreaterThan(0);
        }
    });
});

describe("merchant restock helpers", () => {
    it("merchantWindow buckets time into fixed restock windows", () => {
        expect(merchantWindow(0)).toBe(0);
        expect(merchantWindow(MERCHANT_RESTOCK_MS - 1)).toBe(0);
        expect(merchantWindow(MERCHANT_RESTOCK_MS)).toBe(1);
        expect(merchantWindow(MERCHANT_RESTOCK_MS * 3 + 5)).toBe(3);
    });

    it("merchantRestockRemaining counts down within the window", () => {
        expect(merchantRestockRemaining(0)).toBe(MERCHANT_RESTOCK_MS);
        expect(merchantRestockRemaining(MERCHANT_RESTOCK_MS - 1)).toBe(1);
        // Just past a boundary resets to nearly the full window again.
        expect(merchantRestockRemaining(MERCHANT_RESTOCK_MS + 1)).toBe(MERCHANT_RESTOCK_MS - 1);
    });

    it("merchantPartsBase is deterministic per window+type and within range", () => {
        for (const type of COMPONENT_TYPES) {
            for (let w = 0; w < 200; w++) {
                const value = merchantPartsBase(w, type);
                expect(value).toBe(merchantPartsBase(w, type)); // stable
                expect(value).toBeGreaterThanOrEqual(0);
                expect(value).toBeLessThanOrEqual(MERCHANT_MAX_STOCK);
            }
        }
    });

    it("merchantPartsBase varies across windows (not a constant)", () => {
        const values = new Set<number>();
        for (let w = 0; w < 50; w++) values.add(merchantPartsBase(w, "scrap"));
        expect(values.size).toBeGreaterThan(1);
    });
});
