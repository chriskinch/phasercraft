import { describe, it, expect } from "vitest";
import enemyTypes from "@config/enemies.json";
import { BOSS_SCALING, promoteToBoss, scaleLootTable } from "./area";
import type { EnemyConfig, LootTable } from "@/types/game";

// `promoteToBoss` and `scaleLootTable` are pure config factories — no Phaser
// construction involved — so they're tested directly.

const table: LootTable = [
    { name: "coin", rate: 60, bonus: 2 },
    { name: "cloth", rate: 135, bonus: 1 },
];

describe("scaleLootTable", () => {
    it("multiplies rate and bonus, leaving names alone", () => {
        expect(scaleLootTable(table, 10)).toEqual([
            { name: "coin", rate: 600, bonus: 20 },
            { name: "cloth", rate: 1350, bonus: 10 },
        ]);
    });

    it("preserves the relative rarity of each entry", () => {
        const scaled = scaleLootTable(table, 10);
        expect(scaled[1].rate / scaled[0].rate).toBeCloseTo(table[1].rate / table[0].rate);
    });

    it("rounds to whole rates", () => {
        expect(scaleLootTable([{ name: "gem", rate: 15, bonus: 1 }], 2.5)).toEqual([
            { name: "gem", rate: 38, bonus: 3 },
        ]);
    });

    it("is a no-op at a multiplier of 1", () => {
        expect(scaleLootTable(table, 1)).toEqual(table);
    });

    it("does not mutate the table it is given", () => {
        const original = structuredClone(table);
        scaleLootTable(table, 10);
        expect(table).toEqual(original);
    });
});

describe("promoteToBoss", () => {
    const base = enemyTypes["baby-ghoul"] as EnemyConfig;
    const boss = promoteToBoss("baby-ghoul");

    it("scales the base creature's loot table by BOSS_SCALING.loot", () => {
        expect(boss.loot_table).toEqual(scaleLootTable(base.loot_table, BOSS_SCALING.loot));
    });

    it("drops more of every entry than the creature it was promoted from", () => {
        boss.loot_table.forEach((item, i) => {
            expect(item.rate).toBeGreaterThan(base.loot_table[i].rate);
        });
    });

    it("leaves the base creature's own loot table untouched", () => {
        expect((enemyTypes["baby-ghoul"] as EnemyConfig).loot_table).toEqual(base.loot_table);
        expect(base.loot_table[0].rate).toBe(60);
    });

    it("carries the boss coin multiplier so drops pay out more on pickup", () => {
        expect(boss.coin_multiplier).toBe(BOSS_SCALING.coin_multiplier);
        expect(boss.coin_multiplier).toBeGreaterThan(base.coin_multiplier);
    });
});
