// Typed REST client for the armory item service (`/api/armory/*`). This replaces
// the Apollo GraphQL gateway in the merchant flow (Phase 8): the API is a dumb
// CRUD store, so the display-only `color` field and all sort/filter logic now
// live client-side (previously Apollo cache field policies + the gateway).
//
// The base URL comes from `VITE_ARMORY_URL`. When it is unset the merchant is
// treated as unavailable (mirrors the pre-Phase-8 "no gateway configured" state).

import type { LootItem, LootStat } from "@/types/game";

// Quality → border colour. Ported verbatim from the old Apollo cache field policy
// (`src/lib/cache.ts`); the other derived stat fields there (adjusted/formatted/
// abbreviation) were unused by the merchant UI and are intentionally not ported.
const qualityColors: Record<string, string> = Object.freeze({
    common: "#bbbbbb",
    fine: "#00dd00",
    rare: "#0077ff",
    epic: "#9900ff",
    legendary: "#ff9900",
});

export const colorForQuality = (quality: string): string => qualityColors[quality] ?? "#bbbbbb";

/** Raw item shape returned by the armory API (`api/armory/_lib/types.ts`). */
interface ApiItem {
    id: string;
    name: string;
    category: string;
    set: string;
    icon: string;
    quality: string;
    qualitySort: number;
    cost: number;
    pool: number;
    stats: Array<{ id: string; name: string; value: number }>;
}

/**
 * A merchant store item. Extends the shared `LootItem` (what the loot/icon
 * components render) with the `quality`/`qualitySort`/`pool` fields the Armory's
 * client-side sort and quality colouring need at runtime.
 */
export interface StoreItem extends LootItem {
    quality: string;
    qualitySort: number;
    pool: number;
}

const toStoreItem = (item: ApiItem): StoreItem => ({
    __typename: "Item",
    id: item.id,
    uuid: item.id,
    name: item.name,
    category: item.category,
    set: item.set,
    icon: item.icon,
    cost: item.cost,
    color: colorForQuality(item.quality),
    quality: item.quality,
    qualitySort: item.qualitySort,
    pool: item.pool,
    stats: item.stats.map(
        (stat): LootStat => ({ id: stat.id, name: stat.name, value: stat.value })
    ),
});

/** Whether an armory endpoint is configured (otherwise the merchant is unavailable). */
export const isArmoryConfigured = (): boolean => Boolean(import.meta.env.VITE_ARMORY_URL);

const baseUrl = (): string => {
    const url = import.meta.env.VITE_ARMORY_URL;
    if (!url) throw new Error("VITE_ARMORY_URL is not configured.");
    return url.replace(/\/$/, "");
};

/** GET /items → the full store, mapped to merchant items. */
export async function listItems(): Promise<StoreItem[]> {
    const res = await fetch(`${baseUrl()}/items`);
    if (!res.ok) throw new Error(`Failed to load items (${res.status}).`);
    const data = (await res.json()) as ApiItem[];
    return Array.isArray(data) ? data.map(toStoreItem) : [];
}

/** DELETE /items/:id — remove a purchased item from the store. */
export async function removeItem(id: string): Promise<void> {
    const res = await fetch(`${baseUrl()}/items/${encodeURIComponent(id)}`, { method: "DELETE" });
    if (!res.ok) throw new Error(`Failed to remove item (${res.status}).`);
}

/**
 * Restock the store with `amount` fresh items. The REST API has no single restock
 * endpoint, so this mirrors the old GraphQL `restockStore` resolver: clear, then
 * batch-create.
 */
export async function restock(amount: number): Promise<void> {
    const cleared = await fetch(`${baseUrl()}/store/clear`, { method: "POST" });
    if (!cleared.ok) throw new Error(`Failed to clear store (${cleared.status}).`);

    const created = await fetch(`${baseUrl()}/store/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
    });
    if (!created.ok) throw new Error(`Failed to restock store (${created.status}).`);
}
