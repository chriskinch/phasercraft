import type { LootDropRate, LootTable } from "@/types/game";

// Loot rarity by difficulty (#597): the further out and the harsher the biome,
// the more freely an enemy drops its rarer loot — rare on the forest's doorstep,
// common at the tundra's edge. Each kind of loot has a rarity; a rarity's boost
// `k` sets how hard difficulty pushes it: rate × (1 + (multiplier − 1) × k).
// Common loot is untouched; epic loot climbs fastest.

export type LootRarity = "common" | "uncommon" | "rare" | "epic";

export const RARITY_BOOST: Record<LootRarity, number> = {
    common: 0,
    uncommon: 0.5,
    rare: 1,
    epic: 2,
};

// Every kind of loot needs one (a test checks), so new parts (#601) declare a
// rarity and pick up the boost with no more code.
export const LOOT_RARITY: Record<LootDropRate["name"], LootRarity> = {
    coin: "common",
    scrap: "common",
    cloth: "common",
    bone: "common",
    gem: "uncommon",
    ichor: "uncommon",
    scroll: "rare",
    special: "epic",
};

/** How much a drop of `name` is boosted at `multiplier` (1 at multiplier 1). */
export function rarityBoost(name: LootDropRate["name"], multiplier: number): number {
    return 1 + (multiplier - 1) * RARITY_BOOST[LOOT_RARITY[name]];
}

/**
 * The loot table an enemy at `multiplier` drops from: each entry's `rate` (and
 * its `bonus`, as `scaleLootTable` does) × its rarity's boost, rounded. Entries
 * named in `pinned` are left as they are — a miniboss's one guaranteed special
 * and scroll stay one. At multiplier 1 the table is returned unchanged.
 */
export function boostLootTable(
    table: LootTable,
    multiplier: number,
    pinned: ReadonlySet<LootDropRate["name"]> = new Set()
): LootTable {
    return table.map((item) => {
        if (pinned.has(item.name)) return item;
        const boost = rarityBoost(item.name, multiplier);
        return {
            ...item,
            rate: Math.round(item.rate * boost),
            bonus: Math.round(item.bonus * boost),
        };
    });
}
