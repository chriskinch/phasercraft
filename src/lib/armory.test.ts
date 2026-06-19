import { describe, it, expect } from "vitest";
import { enrichItem } from "./armory";
import type { Item as ApiItem } from "../../api/_lib/types";

const baseItem: ApiItem = {
    id: "1",
    createdAt: 0,
    name: "Iron Sword",
    category: "sword",
    set: "weapon",
    quality: "common",
    qualitySort: 1,
    cost: 5,
    pool: 20,
    icon: "sword_1",
    stats: [{ id: "s1", name: "attack_power", value: 10 }],
};

describe("enrichItem", () => {
    it.each([
        ["common", "#bbbbbb"],
        ["fine", "#00dd00"],
        ["rare", "#0077ff"],
        ["epic", "#9900ff"],
        ["legendary", "#ff9900"],
    ])("maps quality %s to color %s", (quality, color) => {
        const item = enrichItem({ ...baseItem, quality });
        expect(item.color).toBe(color);
    });

    it("falls back to #bbbbbb for an unknown quality", () => {
        const item = enrichItem({ ...baseItem, quality: "mythic" });
        expect(item.color).toBe("#bbbbbb");
    });

    it("passes through all other fields unchanged", () => {
        const item = enrichItem(baseItem);
        expect(item.id).toBe("1");
        expect(item.name).toBe("Iron Sword");
        expect(item.category).toBe("sword");
        expect(item.cost).toBe(5);
        expect(item.pool).toBe(20);
        expect(item.stats).toEqual(baseItem.stats);
    });

    it("converts null set to undefined", () => {
        const item = enrichItem({ ...baseItem, set: undefined });
        expect(item.set).toBeUndefined();
    });
});
