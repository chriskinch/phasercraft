import { describe, it, expect, vi, afterEach } from "vitest";
import type { Sound } from "phaser";
import { playSfx, setSfxManager, sfxGain, SFX } from "./sfx";
import { DEFAULT_SETTINGS, SETTINGS_KEY, writeSettings } from "./settingsStorage";

// Unit tests for the SFX service (#482). The Phaser sound manager is faked at
// the seam: `play` and the audio cache are all the service touches.
const fakeManager = (loaded = true) => {
    const play = vi.fn(() => true);
    const manager = {
        play,
        game: { cache: { audio: { exists: vi.fn(() => loaded) } } },
    } as unknown as Sound.BaseSoundManager;
    return { manager, play };
};

afterEach(() => {
    setSfxManager(null);
    localStorage.clear();
});

describe("sfxGain", () => {
    it("defaults to 0.7", () => {
        expect(sfxGain()).toBe(0.7);
    });

    it("follows the persisted volume", () => {
        writeSettings({ ...DEFAULT_SETTINGS, sfxVolume: 25 });
        expect(sfxGain()).toBe(0.25);
    });

    it("clamps out-of-range values", () => {
        writeSettings({ ...DEFAULT_SETTINGS, sfxVolume: 250 });
        expect(sfxGain()).toBe(1);
        writeSettings({ ...DEFAULT_SETTINGS, sfxVolume: -5 });
        expect(sfxGain()).toBe(0);
    });

    it("falls back to the default for a non-numeric stored value", () => {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify({ sfxVolume: "loud" }));
        expect(sfxGain()).toBe(0.7);
    });
});

describe("playSfx", () => {
    it("plays the effect at the persisted volume", () => {
        const { manager, play } = fakeManager();
        setSfxManager(manager);
        writeSettings({ ...DEFAULT_SETTINGS, sfxVolume: 50 });

        expect(playSfx("power-up")).toBe(true);
        expect(play).toHaveBeenCalledWith("power-up", { volume: 0.5 });
    });

    it("reads the volume on every play, so a change applies straight away", () => {
        const { manager, play } = fakeManager();
        setSfxManager(manager);

        playSfx("power-up");
        writeSettings({ ...DEFAULT_SETTINGS, sfxVolume: 10 });
        playSfx("power-up");

        expect(play).toHaveBeenNthCalledWith(1, "power-up", { volume: 0.7 });
        expect(play).toHaveBeenNthCalledWith(2, "power-up", { volume: 0.1 });
    });

    it("scales the volume by the effect's gain (coin is halved)", () => {
        const { manager, play } = fakeManager();
        setSfxManager(manager);
        writeSettings({ ...DEFAULT_SETTINGS, sfxVolume: 80 });

        playSfx("coin");

        expect(play).toHaveBeenCalledWith("coin", { volume: 0.4 });
    });

    it("is silent when muted", () => {
        const { manager, play } = fakeManager();
        setSfxManager(manager);
        writeSettings({ ...DEFAULT_SETTINGS, sfxVolume: 0 });

        expect(playSfx("power-up")).toBe(false);
        expect(play).not.toHaveBeenCalled();
    });

    it("is a no-op before a game is attached or after it is detached", () => {
        expect(playSfx("power-up")).toBe(false);

        const { manager, play } = fakeManager();
        setSfxManager(manager);
        setSfxManager(null);

        expect(playSfx("power-up")).toBe(false);
        expect(play).not.toHaveBeenCalled();
    });

    it("is a no-op when the audio has not loaded", () => {
        const { manager, play } = fakeManager(false);
        setSfxManager(manager);

        expect(playSfx("power-up")).toBe(false);
        expect(play).not.toHaveBeenCalled();
    });
});

describe("SFX catalog", () => {
    it("points every effect at a file under public/audio/sfx", () => {
        for (const { path } of Object.values(SFX)) {
            expect(path).toMatch(/^audio\/sfx\/.+\.wav$/);
        }
    });
});
