import { describe, it, expect } from "vitest";
import { generateItem } from "./generateItem";
import { createStoredItem } from "./item";
import { Categories, Stats } from "./constants";
import { validate, itemContract } from "../../../test/contract/armoryContract";

const categories = Object.values(Categories) as string[];
const statNames = Object.values(Stats) as string[];
const qualities = ["common", "fine", "rare", "epic", "legendary"];

describe("generateItem", () => {
    it("produces a structurally valid item over many random rolls", () => {
        for (let i = 0; i < 250; i++) {
            const stored = createStoredItem();
            // The stored shape must satisfy the legacy contract exactly.
            expect(validate(itemContract, stored)).toEqual([]);
            expect(categories).toContain(stored.category);
            expect(qualities).toContain(stored.quality);
            expect(stored.qualitySort).toBeGreaterThanOrEqual(1);
            expect(stored.qualitySort).toBeLessThanOrEqual(5);
            expect(stored.icon.startsWith(`${stored.category}_`)).toBe(true);
            expect(stored.stats.length).toBeGreaterThan(0);
            for (const stat of stored.stats) {
                expect(statNames).toContain(stat.name);
                expect(typeof stat.value).toBe("number");
            }
        }
    });

    it("honours explicit overrides", () => {
        const item = generateItem({
            name: "Test Blade",
            category: "sword",
            quality: "legendary",
        });
        expect(item.name).toBe("Test Blade");
        expect(item.category).toBe("sword");
        expect(item.quality).toBe("legendary");
        expect(item.qualitySort).toBe(5);
        expect(item.cost).toBe(200);
    });

    it("converts a stats override into id'd stat entries", () => {
        const item = generateItem({ stats: { attack_power: 12, defence: 7 } });
        const byName = Object.fromEntries(item.stats.map((s) => [s.name, s]));
        expect(item.stats).toHaveLength(2);
        expect(byName.attack_power?.value).toBe(12);
        expect(byName.defence?.value).toBe(7);
        for (const stat of item.stats) expect(typeof stat.id).toBe("string");
    });
});

describe("createStoredItem", () => {
    it("adds a unique id and a createdAt timestamp", () => {
        const a = createStoredItem();
        const b = createStoredItem();
        expect(a.id).not.toBe(b.id);
        expect(typeof a.id).toBe("string");
        expect(typeof a.createdAt).toBe("number");
    });
});
