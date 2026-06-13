import type { RootState } from "@store";

// Typed, error-handled wrapper around the browser localStorage save slots.
// All save-game persistence goes through here so the JSON (de)serialization,
// the error handling (quota/privacy-mode writes, corrupt reads, SSR where
// `localStorage` is undefined), and the on-disk shape live in one place.
//
// The persisted shape is the Redux *root* state (`{ game: {...} }`), which is
// what the save paths write. Callers that need the inner slice read it off
// `.game` — see `loadGame`, which expects a `Partial<GameState>`.

export type SaveData = RootState;

export const SAVE_SLOTS = ["slot_a", "slot_b", "slot_c"] as const;
export type SaveSlot = (typeof SAVE_SLOTS)[number];

// Read and parse a save slot. Returns null for an empty slot, corrupt JSON, or
// any environment where localStorage is unavailable — never throws.
export function readSave(slot: string): SaveData | null {
    try {
        const raw = localStorage.getItem(slot);
        return raw ? (JSON.parse(raw) as SaveData) : null;
    } catch (error) {
        console.warn("Ignoring corrupt save data in slot", slot, error);
        return null;
    }
}

// Serialize and write a save slot. Returns whether the write succeeded;
// localStorage.setItem can throw on quota limits or in privacy mode, and a
// failed save must not crash the caller.
export function writeSave(slot: string, data: SaveData): boolean {
    try {
        localStorage.setItem(slot, JSON.stringify(data));
        return true;
    } catch (error) {
        console.warn("Failed to save game to slot", slot, error);
        return false;
    }
}

// Remove a save slot. Never throws.
export function removeSave(slot: string): void {
    try {
        localStorage.removeItem(slot);
    } catch (error) {
        console.warn("Failed to remove save in slot", slot, error);
    }
}

// Read every slot in order, mapping empty/corrupt slots to null.
export function readAllSaves(slots: readonly string[] = SAVE_SLOTS): (SaveData | null)[] {
    return slots.map(readSave);
}
