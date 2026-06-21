// Storage seam for the armory. The handlers depend only on the `ItemStore`
// interface; the implementation is chosen at runtime:
//   - MemoryItemStore: a plain Map, used by tests, the standalone harness, and
//     local dev (zero infra).
//   - KvItemStore: Vercel KV (an Upstash Redis hash, field = item id, value =
//     the item) for production.
// The factory picks KV when a Vercel KV binding is present (`KV_REST_API_URL`),
// otherwise falls back to memory — so nothing breaks before the maintainer
// provisions the store.

import { kv } from "@vercel/kv";
import type { StoredItem } from "./types";

/** Redis hash key holding the whole shop, field = item id, value = item JSON. */
export const ITEMS_KEY = "armory:items";

export interface ItemStore {
    list(): Promise<StoredItem[]>;
    get(id: string): Promise<StoredItem | null>;
    put(item: StoredItem): Promise<void>;
    putMany(items: StoredItem[]): Promise<void>;
    /** Removes and returns the item (legacy DELETE returns the deleted item), or null if absent. */
    remove(id: string): Promise<StoredItem | null>;
    clear(): Promise<void>;
}

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

export class MemoryItemStore implements ItemStore {
    private items = new Map<string, StoredItem>();

    async list(): Promise<StoredItem[]> {
        return [...this.items.values()].map(clone);
    }

    async get(id: string): Promise<StoredItem | null> {
        const item = this.items.get(id);
        return item ? clone(item) : null;
    }

    async put(item: StoredItem): Promise<void> {
        this.items.set(item.id, clone(item));
    }

    async putMany(items: StoredItem[]): Promise<void> {
        for (const item of items) this.items.set(item.id, clone(item));
    }

    async remove(id: string): Promise<StoredItem | null> {
        const item = this.items.get(id);
        if (!item) return null;
        this.items.delete(id);
        return clone(item);
    }

    async clear(): Promise<void> {
        this.items.clear();
    }
}

export class KvItemStore implements ItemStore {
    async list(): Promise<StoredItem[]> {
        const all = await kv.hgetall<Record<string, StoredItem>>(ITEMS_KEY);
        return all ? Object.values(all) : [];
    }

    async get(id: string): Promise<StoredItem | null> {
        return (await kv.hget<StoredItem>(ITEMS_KEY, id)) ?? null;
    }

    async put(item: StoredItem): Promise<void> {
        await kv.hset(ITEMS_KEY, { [item.id]: item });
    }

    async putMany(items: StoredItem[]): Promise<void> {
        if (items.length === 0) return;
        const entries: Record<string, StoredItem> = {};
        for (const item of items) entries[item.id] = item;
        await kv.hset(ITEMS_KEY, entries);
    }

    async remove(id: string): Promise<StoredItem | null> {
        const existing = await this.get(id);
        if (!existing) return null;
        await kv.hdel(ITEMS_KEY, id);
        return existing;
    }

    async clear(): Promise<void> {
        await kv.del(ITEMS_KEY);
    }
}

let instance: ItemStore | null = null;

/** Returns the process-wide store, creating it from the environment on first use. */
export const getItemStore = (): ItemStore => (instance ??= createItemStore());

/** Test/harness hook to inject a store (and reset between tests). */
export const setItemStore = (store: ItemStore | null): void => {
    instance = store;
};

const createItemStore = (): ItemStore =>
    process.env.KV_REST_API_URL ? new KvItemStore() : new MemoryItemStore();
