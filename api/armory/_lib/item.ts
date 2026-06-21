import { randomUUID } from "node:crypto";
import { generateItem } from "./generateItem";
import type { ItemInput, StoredItem } from "./types";

// Wraps a freshly generated item with the storage fields (`id`, `createdAt`)
// the legacy create/createStore handlers added before persisting. Centralised so
// the single-create and batch-create paths stay identical.
export const createStoredItem = (data?: ItemInput): StoredItem => ({
    id: randomUUID(),
    createdAt: Date.now(),
    ...generateItem(data),
});
