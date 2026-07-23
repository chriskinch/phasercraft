import type { Page } from "@playwright/test";

// Shared E2E helpers. Kept deliberately small and DOM/localStorage-only — the
// game canvas itself is a Phaser `<canvas>` whose internals are not queryable,
// so every assertion in the smoke pack drives the React UI overlay (DOM,
// visible text, buttons) or `localStorage` (the save service's backing store).

// The five playable classes, exactly as rendered as button labels by
// CharacterCard (`text={type}`). See src/ui/components/templates/CharacterSelect.tsx.
export const CHARACTERS = ["Cleric", "Mage", "Occultist", "Ranger", "Warrior"] as const;
export type Character = (typeof CHARACTERS)[number];

// localStorage save slots, mirroring SAVE_SLOTS in src/services/saveStorage.ts.
// The on-disk shape is the Redux *root* state (`{ game: { ... } }`); the Save
// menu reads `wave`/`coins`/`character` off `.game` to render each slot.
export const SAVE_SLOTS = ["slot_a", "slot_b", "slot_c"] as const;

// A component stack as persisted in the save's `components` slice (added by the
// inventory overhaul). Mirrors ComponentStack in src/types/game.ts.
export interface SavedComponentStack {
    id: string;
    type: string;
    quantity: number;
}

// Minimal save payload matching what the Save menu reads back. We only populate
// the fields the Load screen renders (character, wave, coins, saveSlot); the
// rest of GameState is irrelevant to the roundtrip assertion and Redux/Phaser
// tolerate a partial load for the purposes of the DOM check. `components` is
// optional so a save can carry the overhaul's stack slice for the persistence
// roundtrip.
export function makeSave(
    slot: string,
    character: Character,
    wave: number,
    coins: number,
    components?: SavedComponentStack[]
) {
    return {
        game: {
            character,
            saveSlot: slot,
            wave,
            coins,
            ...(components ? { components } : {}),
        },
    };
}

// Seed a save directly into localStorage before the app reads it. Playwright's
// addInitScript runs before page scripts on the next navigation, so the Save
// menu's `readAllSaves` sees the seeded slot on first render.
export async function seedSave(
    page: Page,
    slot: string,
    save: ReturnType<typeof makeSave>
): Promise<void> {
    await page.addInitScript(
        ([key, value]) => {
            window.localStorage.setItem(key, value);
        },
        [slot, JSON.stringify(save)] as const
    );
}

// Wait for the Phaser game to mount its canvas inside the #phaser-game host.
// This is the boot signal: PhaserGame.tsx renders `<div id="phaser-game" />`
// and Phaser injects a `<canvas>` into it once the engine initialises.
export async function expectGameCanvas(page: Page) {
    const host = page.locator("#phaser-game");
    await host.waitFor({ state: "attached" });
    return page.locator("#phaser-game canvas");
}
