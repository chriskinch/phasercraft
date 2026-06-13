import { describe, it, expect, vi, afterEach } from "vitest";
import { readSave, writeSave, removeSave, readAllSaves, SAVE_SLOTS } from "./saveStorage";

// Unit tests for the typed save/storage service (Phase 2, #307). Every save
// path goes through here, so these pin the JSON round-trip, the error handling
// (corrupt reads, failing writes), and the multi-slot read.

afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
});

describe("readSave", () => {
    it("parses and returns the stored save", () => {
        const save = { game: { coins: 7, wave: 2 } };
        localStorage.setItem("slot_a", JSON.stringify(save));

        expect(readSave("slot_a")).toEqual(save);
    });

    it("returns null for an empty slot", () => {
        expect(readSave("slot_a")).toBeNull();
    });

    it("returns null and warns on corrupt JSON without throwing", () => {
        vi.spyOn(console, "warn").mockImplementation(() => {});
        localStorage.setItem("slot_a", "{ not valid json");

        expect(readSave("slot_a")).toBeNull();
        expect(console.warn).toHaveBeenCalled();
    });

    it("returns null and warns when reading throws", () => {
        vi.spyOn(console, "warn").mockImplementation(() => {});
        vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
            throw new DOMException("denied", "SecurityError");
        });

        expect(readSave("slot_a")).toBeNull();
        expect(console.warn).toHaveBeenCalled();
    });
});

describe("writeSave", () => {
    it("serializes the save and reports success", () => {
        const save = { game: { coins: 99 } } as never;

        expect(writeSave("slot_b", save)).toBe(true);
        expect(localStorage.getItem("slot_b")).toBe(JSON.stringify(save));
    });

    it("returns false and warns when the write throws, without throwing", () => {
        vi.spyOn(console, "warn").mockImplementation(() => {});
        vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
            throw new DOMException("quota exceeded", "QuotaExceededError");
        });

        expect(writeSave("slot_b", {} as never)).toBe(false);
        expect(console.warn).toHaveBeenCalled();
    });
});

describe("removeSave", () => {
    it("removes the slot", () => {
        localStorage.setItem("slot_c", JSON.stringify({ game: {} }));

        removeSave("slot_c");

        expect(localStorage.getItem("slot_c")).toBeNull();
    });

    it("warns and does not throw when removal throws", () => {
        vi.spyOn(console, "warn").mockImplementation(() => {});
        vi.spyOn(Storage.prototype, "removeItem").mockImplementation(() => {
            throw new DOMException("denied", "SecurityError");
        });

        expect(() => removeSave("slot_c")).not.toThrow();
        expect(console.warn).toHaveBeenCalled();
    });
});

describe("readAllSaves", () => {
    it("reads every default slot in order, mapping empty/corrupt to null", () => {
        vi.spyOn(console, "warn").mockImplementation(() => {});
        const save = { game: { wave: 5 } };
        localStorage.setItem("slot_a", JSON.stringify(save));
        localStorage.setItem("slot_c", "{ corrupt");

        expect(readAllSaves()).toEqual([save, null, null]);
    });

    it("defaults to the three canonical save slots", () => {
        expect(SAVE_SLOTS).toEqual(["slot_a", "slot_b", "slot_c"]);
    });
});
