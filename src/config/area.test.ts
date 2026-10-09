import { describe, it, expect } from "vitest";
import enemyTypes from "@config/enemies.json";
import {
    MINIBOSS_SCALING,
    DEFAULT_AREA_TUNING,
    promoteToMiniboss,
    resolveAreaTuning,
    scaleLootTable,
} from "./area";
import { DEFAULT_SETTINGS, type Settings } from "@services/settingsStorage";
import { SPECIAL_DROP_RATE } from "@/types/game";
import { SCROLL_DROP_RATE } from "@/lib/scrollDrops";
import type { EnemyConfig, EnemyType, LootTable } from "@/types/game";

// `promoteToMiniboss` and `scaleLootTable` are pure config factories — no Phaser
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

describe("promoteToMiniboss", () => {
    const base = enemyTypes["baby-ghoul"] as EnemyConfig;
    const miniboss = promoteToMiniboss("baby-ghoul");

    // Specials and scrolls are pinned to one per miniboss rather than scaled.
    const scaled = (t: LootTable) =>
        t.filter((item) => item.name !== "special" && item.name !== "scroll");

    it("scales the base creature's loot table by MINIBOSS_SCALING.loot", () => {
        expect(scaled(miniboss.loot_table)).toEqual(
            scaled(scaleLootTable(base.loot_table, MINIBOSS_SCALING.loot))
        );
    });

    it("drops more of every entry than the creature it was promoted from", () => {
        miniboss.loot_table.forEach((item, i) => {
            expect(item.rate).toBeGreaterThan(base.loot_table[i].rate);
        });
    });

    it("drops exactly one special item, unscaled", () => {
        expect(miniboss.loot_table.find((item) => item.name === "special")).toEqual({
            name: "special",
            rate: SPECIAL_DROP_RATE.miniboss,
            bonus: 0,
        });
    });

    it("leaves the base creature's own loot table untouched", () => {
        expect((enemyTypes["baby-ghoul"] as EnemyConfig).loot_table).toEqual(base.loot_table);
        expect(base.loot_table[0].rate).toBe(60);
    });

    it("carries the miniboss coin multiplier so drops pay out more on pickup", () => {
        expect(miniboss.coin_multiplier).toBe(MINIBOSS_SCALING.coin_multiplier);
        expect(miniboss.coin_multiplier).toBeGreaterThan(base.coin_multiplier);
    });
});

describe("resolveAreaTuning", () => {
    it("is the defaults when nothing is overridden", () => {
        expect(resolveAreaTuning(DEFAULT_SETTINGS)).toEqual(DEFAULT_AREA_TUNING);
        expect(resolveAreaTuning({ ...DEFAULT_SETTINGS, debug: true })).toEqual(
            DEFAULT_AREA_TUNING
        );
    });

    it("applies every override", () => {
        const tuning = resolveAreaTuning({
            ...DEFAULT_SETTINGS,
            spawnRadiusOverride: 200,
            liveCapOverride: 2,
            despawnDelaySeconds: 5,
            minibossChancePerCellOverride: 5,
        });

        expect(tuning).toEqual({
            ...DEFAULT_AREA_TUNING,
            radiusOverride: 200,
            liveCap: 2,
            despawnDelayMs: 5000,
            minibossChancePerCell: 0.05,
        });
    });

    it("applies overrides regardless of Debug mode", () => {
        const tuning = resolveAreaTuning({
            ...DEFAULT_SETTINGS,
            debug: false,
            godMode: false,
            liveCapOverride: 2,
        });

        expect(tuning.liveCap).toBe(2);
    });

    it("keeps the default for zero, negative or non-numeric values", () => {
        const tuning = resolveAreaTuning({
            ...DEFAULT_SETTINGS,
            spawnRadiusOverride: Number.NaN,
            liveCapOverride: -3,
            // A hand-edited payload could hold anything.
            despawnDelaySeconds: "10" as unknown as number,
            minibossChancePerCellOverride: -1,
        });

        expect(tuning).toEqual(DEFAULT_AREA_TUNING);
    });

    it("rounds fractional counts down to whole enemies", () => {
        const tuning = resolveAreaTuning({
            ...DEFAULT_SETTINGS,
            liveCapOverride: 2.7,
        });

        expect(tuning.liveCap).toBe(2);
    });

    it("ignores a kills-to-boss override left in an older settings payload", () => {
        // #594 removed the kill count; a stored value must not leak into tuning.
        const legacy = { ...DEFAULT_SETTINGS, killsToBossOverride: 3 } as Settings;

        expect(resolveAreaTuning(legacy)).toEqual(DEFAULT_AREA_TUNING);
    });

    it("does not mutate the shared defaults", () => {
        const before = { ...DEFAULT_AREA_TUNING };

        resolveAreaTuning({ ...DEFAULT_SETTINGS, liveCapOverride: 9 });

        expect(DEFAULT_AREA_TUNING).toEqual(before);
    });
});

describe("special item drops", () => {
    it("gives every regular mob the special drop at the mob rate", () => {
        for (const config of Object.values(enemyTypes) as EnemyConfig[]) {
            expect(config.loot_table.find((item) => item.name === "special")).toEqual({
                name: "special",
                rate: SPECIAL_DROP_RATE.mob,
                bonus: 0,
            });
        }
    });
});

describe("scroll drops", () => {
    it.each(Object.keys(enemyTypes) as EnemyType[])(
        "gives %s one scroll entry at the mob rate",
        (id) => {
            const { loot_table } = enemyTypes[id] as EnemyConfig;
            expect(loot_table.filter((item) => item.name === "scroll")).toEqual([
                { name: "scroll", rate: SCROLL_DROP_RATE.mob, bonus: 0 },
            ]);
        }
    );

    it.each(Object.keys(enemyTypes) as EnemyType[])(
        "gives a %s miniboss exactly one scroll",
        (id) => {
            expect(
                promoteToMiniboss(id).loot_table.filter((item) => item.name === "scroll")
            ).toEqual([{ name: "scroll", rate: SCROLL_DROP_RATE.miniboss, bonus: 0 }]);
        }
    );
});
