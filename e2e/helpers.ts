import type { Page } from "@playwright/test";
import type { RootState } from "@store";
import type { TestAction } from "@services/testHook";

// Shared E2E helpers. Mostly DOM/localStorage — the game canvas is a Phaser
// `<canvas>` whose internals are not queryable, so most assertions in the smoke
// pack drive the React UI overlay (DOM, visible text, buttons) or `localStorage`
// (the save service's backing store).
//
// The exception is the test hook at the bottom of this file: `window.__phasercraft`,
// an allowlisted action space over the store that exists only in dev and in the
// `e2e` build mode. It is the only way into the flows the canvas owns. See
// `src/services/testHook.ts` and docs/ROADMAP.md ("Spike — E2E test hook").

// The five playable classes, exactly as rendered as button labels by
// CharacterCard (`text={type}`). See src/ui/components/templates/CharacterSelect.tsx.
export const CHARACTERS = ["Cleric", "Mage", "Occultist", "Ranger", "Warrior"] as const;
export type Character = (typeof CHARACTERS)[number];

// localStorage save slots, mirroring SAVE_SLOTS in src/services/saveStorage.ts.
// The on-disk shape is the Redux *root* state (`{ game: { ... } }`); the Save
// menu reads `level`/`coins`/`character` off `.game` to render each slot.
export const SAVE_SLOTS = ["slot_a", "slot_b", "slot_c"] as const;

// A component stack as persisted in the save's `components` slice (added by the
// inventory overhaul). Mirrors ComponentStack in src/types/game.ts.
export interface SavedComponentStack {
    id: string;
    type: string;
    quantity: number;
}

// Minimal save payload matching what the Save menu reads back. We populate the
// fields the Load screen renders (character, level, coins, saveSlot) plus the
// slices a loaded run needs to render: `loadGame` *replaces* the state with the
// save, so anything the overlays destructure has to be present or the screen
// throws (the Equipment panel destructures `equipment`). The rest of GameState
// is irrelevant to the roundtrip assertions and Redux/Phaser tolerate a partial
// load. `components` is optional so a save can carry the overhaul's stack slice
// for the persistence roundtrip.
export function makeSave(
    slot: string,
    character: Character,
    currentLevel: number,
    coins: number,
    components?: SavedComponentStack[]
) {
    return {
        game: {
            character,
            saveSlot: slot,
            level: { currentLevel, xpRemaining: 0, toNextLevel: 100 },
            coins,
            equipment: { amulet: null, body: null, helm: null, weapon: null },
            inventory: [],
            filters: [],
            selected: null,
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

// ── Test hook (window.__phasercraft) ─────────────────────────────────────────
//
// Present only in `npm run dev` and `npm run build:e2e`; a plain `npm run build`
// drops it, so a smoke run against the wrong bundle fails here with a pointer at
// the right script rather than timing out on an opaque predicate.

export async function waitForTestHook(page: Page): Promise<void> {
    try {
        await page.waitForFunction(() => Boolean(window.__phasercraft), undefined, {
            timeout: 15_000,
        });
    } catch {
        throw new Error(
            "window.__phasercraft was never installed. Build the app with `npm run build:e2e` " +
                "(Vite mode `e2e`) before running the smoke pack — a plain `npm run build` strips the hook."
        );
    }
}

// A detached snapshot of the Redux store, including the run state only the
// Phaser canvas renders (enemiesRemaining, bossActive, currentArea).
export async function gameState(page: Page): Promise<RootState> {
    return page.evaluate(() => {
        const hook = window.__phasercraft;
        if (!hook) throw new Error("window.__phasercraft is not installed");
        return hook.getState();
    });
}

// The actions the game will accept right now, indexed from 1.
export async function actionSpace(page: Page): Promise<TestAction[]> {
    return page.evaluate(() => {
        const hook = window.__phasercraft;
        if (!hook) throw new Error("window.__phasercraft is not installed");
        return hook.actions();
    });
}

// Run one row of the current action space by id (or 1-based index). Rejects when
// the row is not available here or the value is outside the row's options — the
// rejection message is worth asserting on, it is the guard doing its job.
export async function runAction(
    page: Page,
    target: string | number,
    value?: string
): Promise<TestAction> {
    return page.evaluate(
        ({ target, value }) => {
            const hook = window.__phasercraft;
            if (!hook) throw new Error("window.__phasercraft is not installed");
            return hook.perform(target, value ?? undefined);
        },
        { target, value: value ?? null }
    );
}
