import { describe, it, expect, vi, afterEach } from "vitest";
import {
    readSettings,
    writeSettings,
    DEFAULT_SETTINGS,
    SETTINGS_KEY,
    type Settings,
} from "./settingsStorage";

// Unit tests for the typed settings/storage service (#378). All settings
// persistence goes through here, so these pin the defaults, the JSON round-trip,
// the corrupt-read fallback, and the partial-merge-over-defaults behaviour.

afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
});

describe("readSettings", () => {
    it("returns the defaults when nothing is stored", () => {
        expect(readSettings()).toEqual(DEFAULT_SETTINGS);
    });

    it("round-trips a written value", () => {
        const settings: Settings = {
            debug: true,
            installBannerDismissed: true,
            startingCoins: 250,
            startLocation: "combat",
        };
        expect(writeSettings(settings)).toBe(true);
        expect(readSettings()).toEqual(settings);
    });

    it("falls back to defaults on corrupt JSON without throwing", () => {
        vi.spyOn(console, "warn").mockImplementation(() => {});
        localStorage.setItem(SETTINGS_KEY, "{ not valid json");

        expect(() => readSettings()).not.toThrow();
        expect(readSettings()).toEqual(DEFAULT_SETTINGS);
        expect(console.warn).toHaveBeenCalled();
    });

    it("merges a partial stored object over the defaults", () => {
        // Store a payload missing most fields; the defaults should fill them in
        // while the one provided field is preserved.
        localStorage.setItem(SETTINGS_KEY, JSON.stringify({ startingCoins: 500 }));

        expect(readSettings()).toEqual({ ...DEFAULT_SETTINGS, startingCoins: 500 });
        expect(readSettings().debug).toBe(false);
        expect(readSettings().installBannerDismissed).toBe(false);
        expect(readSettings().startLocation).toBe("default");
    });

    it("returns defaults for a non-object payload", () => {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify("not-an-object"));

        expect(readSettings()).toEqual(DEFAULT_SETTINGS);
    });
});

describe("writeSettings", () => {
    it("serializes the settings under the settings key and reports success", () => {
        const settings: Settings = {
            debug: true,
            installBannerDismissed: false,
            startingCoins: 999,
            startLocation: "default",
        };

        expect(writeSettings(settings)).toBe(true);
        expect(localStorage.getItem(SETTINGS_KEY)).toBe(JSON.stringify(settings));
    });

    it("returns false and warns when the write throws, without throwing", () => {
        vi.spyOn(console, "warn").mockImplementation(() => {});
        vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
            throw new DOMException("quota exceeded", "QuotaExceededError");
        });

        expect(
            writeSettings({
                debug: true,
                installBannerDismissed: false,
                startingCoins: 999,
                startLocation: "default",
            })
        ).toBe(false);
        expect(console.warn).toHaveBeenCalled();
    });
});
