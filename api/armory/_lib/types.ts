// Shared types for the Armory API. These describe the same shape pinned by the
// structural contract in `test/contract/armoryContract.ts`.

import type { Categories, Stats } from "./constants";

/** A category string, e.g. "sword" | "amulet" | … (the enum's values). */
export type Category = `${Categories}`;

/** A stat name string, e.g. "attack_power" | "health_max" | … */
export type StatName = `${Stats}`;

export type Quality = "common" | "fine" | "rare" | "epic" | "legendary";

/** A single allocated stat on an item. */
export interface Stat {
    id: string;
    name: string;
    value: number;
}

/** Stats passed in as overrides on create: `{ attack_power: 12, … }`. */
export type StatGroup = Partial<Record<StatName, number>>;

/** Optional overrides accepted by `POST /items` — any omitted field is generated. */
export interface ItemInput {
    name?: string;
    category?: Category;
    set?: string;
    icon?: string;
    quality?: Quality;
    qualitySort?: number;
    cost?: number;
    pool?: number;
    stats?: StatGroup;
}

/** A fully generated item, before it is given an id and a timestamp. */
export interface GeneratedItem {
    name: string;
    category: string;
    set: string | undefined;
    quality: string;
    qualitySort: number;
    cost: number;
    pool: number;
    icon: string;
    stats: Stat[];
}

/** A generated item as stored and returned by the API. */
export interface StoredItem extends GeneratedItem {
    id: string;
    createdAt: number;
}
