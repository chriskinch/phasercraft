// Typed, error-handled wrapper around the browser localStorage for user
// settings. Mirrors the save/storage service (`saveStorage.ts`): the JSON
// (de)serialization, the error handling (quota/privacy-mode writes, corrupt
// reads, SSR where `localStorage` is undefined), and the on-disk shape all
// live in one place so no caller touches `localStorage` directly.
//
// Settings live under their own key, distinct from the `slot_a/b/c` save slots.

// Where a new game drops the player. "default" is the game's normal entry
// (currently Town, but that may change); "combat" jumps straight into the
// default biome, which speeds up manual testing of combat.
export type StartLocation = "default" | "combat";

export interface Settings {
    // Reveals every setting except sfxVolume on the Settings screen; while it is
    // off those are at their defaults (see withGodModeGate).
    godMode: boolean;
    debug: boolean;
    installBannerDismissed: boolean;
    // A new game starts with the starter kit (see STARTER_ITEMS in the game
    // reducer) instead of an empty purse, for testing shop/craft flows.
    starterItems: boolean;
    startLocation: StartLocation;
    // Only read while `debug` is on.
    spawnDebugOverlay: boolean;
    // Spawn tuning for the enemy spawner (#456), independent of `debug` (but,
    // like every setting except sfxVolume, behind God mode).
    // Each number is 0 for "use the default", so these stay flat fields the
    // shallow merge in readSettings() can fill in.
    // A fixed spawn/despawn radius in world px; 0 derives it from the viewport.
    spawnRadiusOverride: number;
    liveCapOverride: number;
    killsToBossOverride: number;
    despawnDelaySeconds: number;
    // Sound effect volume, 0–100; 0 mutes them. Read on every play, so a change
    // applies straight away (see services/sfx.ts).
    sfxVolume: number;
}

export const DEFAULT_SETTINGS: Settings = {
    godMode: false,
    debug: false,
    installBannerDismissed: false,
    starterItems: false,
    startLocation: "default",
    spawnDebugOverlay: false,
    spawnRadiusOverride: 0,
    liveCapOverride: 0,
    killsToBossOverride: 0,
    despawnDelaySeconds: 0,
    sfxVolume: 70,
};

export const SETTINGS_KEY = "settings";

// With God mode off, every setting behind it is at its default: the Settings
// screen resets them when God mode is switched off, and readSettings() applies
// this to any stored payload (e.g. one saved before God mode existed).
export function withGodModeGate(settings: Settings): Settings {
    if (settings.godMode) return settings;
    return {
        ...settings,
        debug: DEFAULT_SETTINGS.debug,
        spawnDebugOverlay: DEFAULT_SETTINGS.spawnDebugOverlay,
        starterItems: DEFAULT_SETTINGS.starterItems,
        startLocation: DEFAULT_SETTINGS.startLocation,
        spawnRadiusOverride: DEFAULT_SETTINGS.spawnRadiusOverride,
        liveCapOverride: DEFAULT_SETTINGS.liveCapOverride,
        killsToBossOverride: DEFAULT_SETTINGS.killsToBossOverride,
        despawnDelaySeconds: DEFAULT_SETTINGS.despawnDelaySeconds,
    };
}

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
        return withGodModeGate({ ...DEFAULT_SETTINGS, ...(parsed as Partial<Settings>) });
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
