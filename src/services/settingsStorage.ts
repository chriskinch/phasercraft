// Typed, error-handled wrapper around the browser localStorage for user
// settings. Mirrors the save/storage service (`saveStorage.ts`): the JSON
// (de)serialization, the error handling (quota/privacy-mode writes, corrupt
// reads, SSR where `localStorage` is undefined), and the on-disk shape all
// live in one place so no caller touches `localStorage` directly.
//
// Settings live under their own key, distinct from the `slot_a/b/c` save slots.

export interface Settings {
    debug: boolean;
    installBannerDismissed: boolean;
}

export const DEFAULT_SETTINGS: Settings = { debug: false, installBannerDismissed: false };

export const SETTINGS_KEY = "settings";

// Read the persisted settings, merged over the defaults. A missing key, corrupt
// JSON, a non-object payload, or any environment where localStorage is
// unavailable all fall back to the defaults — never throws.
export function readSettings(): Settings {
    try {
        const raw = localStorage.getItem(SETTINGS_KEY);
        if (!raw) {
            return { ...DEFAULT_SETTINGS };
        }
        const parsed = JSON.parse(raw) as unknown;
        if (typeof parsed !== "object" || parsed === null) {
            return { ...DEFAULT_SETTINGS };
        }
        // Merge stored fields over the defaults so a partial or forward-compatible
        // payload still yields a complete, well-typed Settings object.
        return { ...DEFAULT_SETTINGS, ...(parsed as Partial<Settings>) };
    } catch (error) {
        console.warn("Ignoring corrupt settings data", error);
        return { ...DEFAULT_SETTINGS };
    }
}

// Serialize and write the settings. Returns whether the write succeeded;
// localStorage.setItem can throw on quota limits or in privacy mode, and a
// failed write must not crash the caller.
export function writeSettings(settings: Settings): boolean {
    try {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
        return true;
    } catch (error) {
        console.warn("Failed to save settings", error);
        return false;
    }
}
