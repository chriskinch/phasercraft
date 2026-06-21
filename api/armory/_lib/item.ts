import { v4 as uuidv4 } from "uuid";
import { generateItem } from "./generateItem";
import type { ItemInput, StoredItem } from "./types";

// Wraps a freshly generated item with the storage fields (`id`, `createdAt`)
// the legacy create/createStore handlers added before persisting. Centralised so
// the single-create and batch-create paths stay identical.
export const createStoredItem = (data?: ItemInput): StoredItem => ({
    id: uuidv4(),
    createdAt: Date.now(),
    ...generateItem(data),
});
