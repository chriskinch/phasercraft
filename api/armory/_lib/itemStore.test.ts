import { describe, it, expect, beforeEach } from "vitest";
import { MemoryItemStore } from "./itemStore";
import { createStoredItem } from "./item";
import type { StoredItem } from "./types";

describe("MemoryItemStore", () => {
    let store: MemoryItemStore;
    let item: StoredItem;

    beforeEach(() => {
        store = new MemoryItemStore();
        item = createStoredItem();
    });

    it("starts empty", async () => {
        expect(await store.list()).toEqual([]);
    });

    it("puts and gets an item by id", async () => {
        await store.put(item);
        expect(await store.get(item.id)).toEqual(item);
        expect(await store.list()).toHaveLength(1);
    });

    it("returns null for a missing id", async () => {
        expect(await store.get("nope")).toBeNull();
    });

    it("putMany stores a batch", async () => {
        const batch = [createStoredItem(), createStoredItem(), createStoredItem()];
        await store.putMany(batch);
        expect(await store.list()).toHaveLength(3);
    });

    it("remove deletes and returns the item; second remove is null", async () => {
        await store.put(item);
        expect(await store.remove(item.id)).toEqual(item);
        expect(await store.get(item.id)).toBeNull();
        expect(await store.remove(item.id)).toBeNull();
    });

    it("clear empties the store", async () => {
        await store.putMany([createStoredItem(), createStoredItem()]);
        await store.clear();
        expect(await store.list()).toEqual([]);
    });

    it("stores copies, not references (mutating a returned item can't corrupt the store)", async () => {
        await store.put(item);
        const fetched = await store.get(item.id);
        fetched!.cost = -999;
        expect((await store.get(item.id))!.cost).toBe(item.cost);
    });
});
