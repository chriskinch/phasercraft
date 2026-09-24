import { describe, it, expect } from "vitest";
import enemyTypes from "@config/enemies.json";
import {
    BOSS_SCALING,
    DEFAULT_AREA_TUNING,
    promoteToBoss,
    resolveAreaTuning,
    scaleLootTable,
} from "./area";
import { DEFAULT_SETTINGS } from "@services/settingsStorage";
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

describe("resolveAreaTuning", () => {
    const debugOn = { ...DEFAULT_SETTINGS, debug: true };

    it("is the defaults when nothing is overridden", () => {
        expect(resolveAreaTuning(DEFAULT_SETTINGS)).toEqual(DEFAULT_AREA_TUNING);
        expect(resolveAreaTuning(debugOn)).toEqual(DEFAULT_AREA_TUNING);
    });

    it("applies every override while Debug mode is on", () => {
        const tuning = resolveAreaTuning({
            ...debugOn,
            spawnRadiusOverride: 200,
            liveCapOverride: 2,
            killsToBossOverride: 3,
            despawnDelaySeconds: 5,
        });

        expect(tuning).toEqual({
            ...DEFAULT_AREA_TUNING,
            radiusOverride: 200,
            liveCap: 2,
            killsToBoss: 3,
            despawnDelayMs: 5000,
        });
    });

    it("ignores every override while Debug mode is off", () => {
        const tuning = resolveAreaTuning({
            ...DEFAULT_SETTINGS,
            debug: false,
            spawnRadiusOverride: 200,
            liveCapOverride: 2,
            killsToBossOverride: 3,
            despawnDelaySeconds: 5,
        });

        expect(tuning).toEqual(DEFAULT_AREA_TUNING);
    });

    it("keeps the default for zero, negative or non-numeric values", () => {
        const tuning = resolveAreaTuning({
            ...debugOn,
            spawnRadiusOverride: 0,
            liveCapOverride: -3,
            killsToBossOverride: Number.NaN,
            // A hand-edited payload could hold anything.
            despawnDelaySeconds: "10" as unknown as number,
        });

        expect(tuning).toEqual(DEFAULT_AREA_TUNING);
    });

    it("rounds fractional counts down to whole enemies", () => {
        const tuning = resolveAreaTuning({
            ...debugOn,
            liveCapOverride: 2.7,
            killsToBossOverride: 4.2,
        });

        expect(tuning.liveCap).toBe(2);
        expect(tuning.killsToBoss).toBe(4);
    });

    it("does not mutate the shared defaults", () => {
        const before = { ...DEFAULT_AREA_TUNING };

        resolveAreaTuning({ ...debugOn, liveCapOverride: 9 });

        expect(DEFAULT_AREA_TUNING).toEqual(before);
    });
});
