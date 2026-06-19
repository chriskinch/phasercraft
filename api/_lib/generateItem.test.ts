// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("fantasy-content-generator", () => ({
    MagicItems: {
        generate: vi.fn(() => ({
            formattedData: { title: "Sword of Testing" },
        })),
    },
}));

vi.mock("uuid", () => ({ v4: vi.fn(() => "test-uuid") }));

import { generateItem } from "./generateItem";

describe("generateItem", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("returns an item with all required fields", () => {
        const item = generateItem();
        expect(item).toMatchObject({
            name: expect.any(String),
            category: expect.any(String),
            quality: expect.any(String),
            qualitySort: expect.any(Number),
            cost: expect.any(Number),
            pool: expect.any(Number),
            icon: expect.any(String),
            stats: expect.any(Array),
        });
    });

    it("uses FCG-generated name when none provided", () => {
        const item = generateItem();
        expect(item.name).toBe("Sword of Testing");
    });

    it("uses provided name over generated", () => {
        const item = generateItem({ name: "Custom Blade" });
        expect(item.name).toBe("Custom Blade");
    });

    it("uses provided category", () => {
        const item = generateItem({ category: "sword" });
        expect(item.category).toBe("sword");
    });

    it("icon string starts with category", () => {
        const item = generateItem({ category: "sword" });
        expect(item.icon).toMatch(/^sword_\d+$/);
    });

    it("uses provided quality and derives correct sort/cost", () => {
        const item = generateItem({ quality: "legendary" });
        expect(item.quality).toBe("legendary");
        expect(item.qualitySort).toBe(5);
        expect(item.cost).toBe(200);
    });

    it("stats array contains valid stat objects", () => {
        const item = generateItem();
        expect(item.stats.length).toBeGreaterThan(0);
        for (const stat of item.stats) {
            expect(stat).toMatchObject({
                id: expect.any(String),
                name: expect.any(String),
                value: expect.any(Number),
            });
        }
    });

    it("uses provided stats with generated IDs", () => {
        const item = generateItem({ stats: { attack_power: 50 } });
        expect(item.stats).toEqual([{ id: "test-uuid", name: "attack_power", value: 50 }]);
    });

    it("maps sword category to weapon set", () => {
        const item = generateItem({ category: "sword" });
        expect(item.set).toBe("weapon");
    });

    it("maps armor category to body set", () => {
        const item = generateItem({ category: "armor" });
        expect(item.set).toBe("body");
    });

    it("maps helmet category to helm set", () => {
        const item = generateItem({ category: "helmet" });
        expect(item.set).toBe("helm");
    });

    it("maps gem category to amulet set", () => {
        const item = generateItem({ category: "gem" });
        expect(item.set).toBe("amulet");
    });
});
