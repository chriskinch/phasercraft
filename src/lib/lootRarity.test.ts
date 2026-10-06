import { describe, it, expect } from "vitest";
import enemyTypes from "@config/enemies.json";
import { MINIBOSS_PINNED_LOOT, promoteToMiniboss } from "@config/area";
import type { EnemyConfig, EnemyType, LootTable } from "@/types/game";
import { LOOT_RARITY, RARITY_BOOST, boostLootTable, rarityBoost } from "./lootRarity";

const TABLE: LootTable = [
    { name: "coin", rate: 60, bonus: 2 },
    { name: "gem", rate: 20, bonus: 2 },
    { name: "scroll", rate: 5, bonus: 0 },
    { name: "special", rate: 1, bonus: 0 },
];

const rate = (table: LootTable, name: string) => table.find((i) => i.name === name)!.rate;

describe("LOOT_RARITY", () => {
    it("gives every kind of loot an enemy can drop a rarity", () => {
        const names = new Set(
            Object.values(enemyTypes).flatMap((e) =>
                (e as EnemyConfig).loot_table.map((item) => item.name)
            )
        );
        names.forEach((name) => expect(LOOT_RARITY).toHaveProperty(name));
    });

    it("ships common 0, uncommon 0.5, rare 1, epic 2", () => {
        expect(RARITY_BOOST).toEqual({ common: 0, uncommon: 0.5, rare: 1, epic: 2 });
        expect(LOOT_RARITY.coin).toBe("common");
        expect(LOOT_RARITY.gem).toBe("uncommon");
        expect(LOOT_RARITY.ichor).toBe("uncommon");
        expect(LOOT_RARITY.scroll).toBe("rare");
        expect(LOOT_RARITY.special).toBe("epic");
    });
});

describe("rarityBoost", () => {
    it.each([
        ["coin", 1, 1],
        ["coin", 3, 1],
        ["coin", 6, 1],
        ["gem", 1, 1],
        ["gem", 3, 2],
        ["gem", 6, 3.5],
        ["scroll", 1, 1],
        ["scroll", 3, 3],
        ["scroll", 6, 6],
        ["special", 1, 1],
        ["special", 3, 5],
        ["special", 6, 11],
    ] as const)("%s at ×%s is ×%s", (name, multiplier, expected) => {
        expect(rarityBoost(name, multiplier)).toBeCloseTo(expected);
    });
});

describe("boostLootTable", () => {
    it("returns today's table unchanged at multiplier 1", () => {
        expect(boostLootTable(TABLE, 1)).toEqual(TABLE);
    });

    it("leaves every real enemy and miniboss table exactly as today at multiplier 1", () => {
        (Object.keys(enemyTypes) as EnemyType[]).forEach((id) => {
            const table = (enemyTypes[id] as EnemyConfig).loot_table;
            expect(boostLootTable(table, 1)).toEqual(table);
            const miniboss = promoteToMiniboss(id).loot_table;
            expect(boostLootTable(miniboss, 1, MINIBOSS_PINNED_LOOT)).toEqual(miniboss);
        });
    });

    it("leaves common loot alone and raises the rarer the faster", () => {
        const boosted = boostLootTable(TABLE, 6);

        expect(rate(boosted, "coin")).toBe(60);
        expect(rate(boosted, "gem")).toBe(70);
        // 5% → 30% and 1% → 11% at the tundra's far edge.
        expect(rate(boosted, "scroll")).toBe(30);
        expect(rate(boosted, "special")).toBe(11);
    });

    it("scales each entry's bonus roll alongside its rate", () => {
        expect(boostLootTable(TABLE, 6).find((i) => i.name === "gem")!.bonus).toBe(7);
    });

    it("leaves pinned entries exactly as they are", () => {
        const pinned = boostLootTable(TABLE, 6, new Set(["special", "scroll"]));

        expect(rate(pinned, "special")).toBe(1);
        expect(rate(pinned, "scroll")).toBe(5);
        expect(rate(pinned, "gem")).toBe(70);
    });

    it("keeps a miniboss to exactly one special and one scroll at any difficulty", () => {
        expect([...MINIBOSS_PINNED_LOOT].sort()).toEqual(["scroll", "special"]);
        (Object.keys(enemyTypes) as EnemyType[]).forEach((id) => {
            const miniboss = promoteToMiniboss(id).loot_table;
            const boosted = boostLootTable(miniboss, 6, MINIBOSS_PINNED_LOOT);
            expect(rate(boosted, "special")).toBe(rate(miniboss, "special"));
            expect(rate(boosted, "scroll")).toBe(rate(miniboss, "scroll"));
        });
    });
});
