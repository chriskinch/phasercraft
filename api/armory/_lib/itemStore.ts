// Storage seam for the armory. The handlers depend only on the `ItemStore`
// interface; the implementation is chosen at runtime:
//   - MemoryItemStore: a plain Map, used by tests, the standalone harness, and
//     local dev (zero infra).
//   - RedisItemStore: a Redis hash (field = item id, value = JSON), backed by the
//     `REDIS_URL` connection string that the Vercel KV / Upstash store injects.
// The factory picks Redis when `REDIS_URL` is present, otherwise falls back to
// memory — so nothing breaks before the store is provisioned.

import type Redis from "ioredis";
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

// One client per warm function instance. ioredis is loaded via dynamic import
// (so a load/connection failure surfaces inside the request — catchable by
// withErrors — rather than as an opaque module-load crash) and configured to
// fail fast instead of retry-looping until the function times out.
let redis: Redis | null = null;
const client = async (): Promise<Redis> => {
    if (redis) return redis;
    const { default: RedisCtor } = await import("ioredis");
    // Serverless-friendly: the first command waits for the connection (offline
    // queue left on), with a generous connect timeout and a bounded reconnect so
    // a transient blip retries a few times but a real failure still surfaces.
    redis = new RedisCtor(process.env.REDIS_URL as string, {
        connectTimeout: 10000,
        maxRetriesPerRequest: 5,
        retryStrategy: (times: number) => (times > 5 ? null : Math.min(times * 200, 2000)),
    });
    return redis;
};

const parse = (value: string | null): StoredItem | null =>
    value ? (JSON.parse(value) as StoredItem) : null;

export class RedisItemStore implements ItemStore {
    async list(): Promise<StoredItem[]> {
        const all = await (await client()).hgetall(ITEMS_KEY);
        return Object.values(all).map((v) => JSON.parse(v) as StoredItem);
    }

    async get(id: string): Promise<StoredItem | null> {
        return parse(await (await client()).hget(ITEMS_KEY, id));
    }

    async put(item: StoredItem): Promise<void> {
        await (await client()).hset(ITEMS_KEY, item.id, JSON.stringify(item));
    }

    async putMany(items: StoredItem[]): Promise<void> {
        if (items.length === 0) return;
        const pairs: Record<string, string> = {};
        for (const item of items) pairs[item.id] = JSON.stringify(item);
        await (await client()).hset(ITEMS_KEY, pairs);
    }

    async remove(id: string): Promise<StoredItem | null> {
        const existing = await this.get(id);
        if (!existing) return null;
        await (await client()).hdel(ITEMS_KEY, id);
        return existing;
    }

    async clear(): Promise<void> {
        await (await client()).del(ITEMS_KEY);
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
    process.env.REDIS_URL ? new RedisItemStore() : new MemoryItemStore();
