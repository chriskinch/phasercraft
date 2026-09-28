import type { Sound } from "phaser";
import { DEFAULT_SETTINGS, readSettings } from "@services/settingsStorage";

// Sound effects service (#482): lets React and Phaser entities play a named
// effect without holding a reference to the game.
//
// Playback goes through Phaser's global sound manager (`game.sound`), not a
// scene's: it keeps playing while the town scene is paused behind a menu, and
// Phaser already handles the browser autoplay unlock (it listens for the first
// touch/click/key on the page). `PhaserGame` attaches the manager once the game
// exists and detaches it when the game is destroyed; until then, plays are
// silent no-ops.
//
// Nothing is subscribed and no sound instance is kept: `play()` creates a
// one-shot that destroys itself on completion, and the volume setting is read
// on every play so a change in Settings applies straight away. There is
// therefore nothing to `cleanup()` here beyond detaching the manager.

// Every effect the game can play, keyed by its Phaser cache key. Assets are
// preloaded in LoadScene from these paths (relative to public/).
//  - power-up: a successful Blacksmith craft
//  - coin: picking up coins, gems and crafting components
//  - explosion: Fireball/Frostbolt impacts, and ranged enemies' bolts
//    hitting the player
//  - hurt: every auto-attack hit — the player's (melee, or the Ranger's
//    arrow on impact) and non-ranged enemies' hits on the player
// public/audio/sfx/jump.wav is committed but unused, so it is not loaded.
export const SFX = {
    "power-up": "audio/sfx/power-up.wav",
    coin: "audio/sfx/coin.wav",
    explosion: "audio/sfx/explosion.wav",
    hurt: "audio/sfx/hurt.wav",
} as const;

export type SfxKey = keyof typeof SFX;

let manager: Sound.BaseSoundManager | null = null;

/** Attach the game's sound manager; pass null when the game is destroyed. */
export function setSfxManager(next: Sound.BaseSoundManager | null): void {
    manager = next;
}

/** The persisted SFX volume as a 0–1 gain; a non-numeric value falls back to the default. */
export function sfxGain(): number {
    const stored = readSettings().sfxVolume;
    const volume = Number.isFinite(stored) ? stored : DEFAULT_SETTINGS.sfxVolume;
    return Math.min(100, Math.max(0, volume)) / 100;
}

/**
 * Play a one-shot effect at the persisted volume. Returns whether it started:
 * false when muted (volume 0), when no game is attached, or when the audio
 * has not loaded.
 */
export function playSfx(key: SfxKey): boolean {
    const volume = sfxGain();
    if (volume === 0 || !manager || !manager.game.cache.audio.exists(key)) return false;
    return manager.play(key, { volume });
}
