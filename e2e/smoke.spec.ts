import { test, expect } from "@playwright/test";
import { CHARACTERS, makeSave, seedSave, expectGameCanvas } from "./helpers";

// Smoke pack for Phasercraft (Phase 4, #309) — runs on every PR.
//
// The game is a Phaser `<canvas>` with a React/Redux UI overlay drawn on top.
// Canvas internals are not queryable from the DOM, so every assertion here
// drives the React overlay (visible text, buttons, ids) or `localStorage`
// (the save service's backing store). Where a flow is genuinely canvas-only
// (the wave readout), it is marked `test.fixme` with the reason inline rather
// than shipped as a flaky/failing test.
//
// Boot sequence the specs rely on (see src/scenes/LoadScene.ts):
//   LoadScene.create() dispatches toggleUi("save") and starts SelectScene, so
//   the "Pick a Game Save" overlay is the first interactive UI. Each empty slot
//   offers a "Select" button -> setSaveSlot + switchUi("select") -> the
//   "Character Select" menu. Picking a character dispatches selectCharacter,
//   which sets showUi:false (the overlay closes and the run begins).

test.describe("Phasercraft smoke", () => {
    // ── Flow 1: game boots ───────────────────────────────────────────────────
    test("game boots: page mounts, canvas renders, initial UI appears", async ({ page }) => {
        await page.goto("/");

        // The Phaser host div is always rendered by React.
        await expect(page.locator("#phaser-game")).toBeAttached();

        // Phaser injects a <canvas> once the engine initialises — the boot signal.
        const canvas = await expectGameCanvas(page);
        await expect(canvas).toBeAttached();

        // LoadScene.create() opens the "Pick a Game Save" overlay once the scene
        // boots and preload completes. We key off the menu shell
        // ([data-testid="menu-container"], rendered only while a menu is open) plus
        // the save-slot headings rather
        // than the menu's derived id: UI.tsx builds the id with
        // `title.toLowerCase().replace(" ", "-")`, and String.replace swaps only
        // the FIRST space, so "Pick a Game Save" yields the id "pick-a game save"
        // (a pre-existing quirk). Visible text / slot headings are the stable hook.
        await expect(page.locator('[data-testid="menu-container"]')).toBeVisible();
        // Three save slots render with "Slot 1".."Slot 3" headings.
        await expect(page.getByRole("heading", { name: "Slot 1" })).toBeVisible();
    });

    // ── Flow 2: character select ─────────────────────────────────────────────
    test("character select: choosing a class closes the overlay and starts the run", async ({
        page,
    }) => {
        await page.goto("/");
        await expectGameCanvas(page);

        // From the save menu, an empty slot's "Select" button opens character select.
        // (The save menu's derived id contains a space — see Flow 1 — so key off the
        // menu shell and the Select button instead.)
        await expect(page.locator('[data-testid="menu-container"]')).toBeVisible();
        await page.getByRole("button", { name: "Select" }).first().click();

        // The Character Select menu renders ("Character Select" has a single space,
        // so its derived id "character-select" is well-formed); assert a button per
        // playable class as the stable signal.
        await expect(page.locator("#character-select")).toBeVisible();
        for (const name of CHARACTERS) {
            await expect(page.getByRole("button", { name, exact: true })).toBeVisible();
        }

        // Picking a class dispatches selectCharacter -> showUi:false, so the whole
        // UI overlay (header + menu container) is torn down and the run view shows.
        await page.getByRole("button", { name: "Warrior", exact: true }).click();
        await expect(page.locator("#character-select")).toBeHidden();
        await expect(page.locator('[data-testid="menu-container"]')).toHaveCount(0);
        // The game canvas is still present underneath — we're now in the run.
        await expect(page.locator("#phaser-game canvas")).toBeAttached();
    });

    // ── Flow 3: wave starts ──────────────────────────────────────────────────
    //
    // The wave readout ("Wave: N") is drawn by a Phaser GameObjects.Text on the
    // canvas (src/entities/UI/HUD.ts), and the React HUD overlay shows only level
    // info, not the wave. There is no DOM node carrying the wave value, and the
    // store is not exposed on `window`, so a DOM-level assertion that the wave
    // started/incremented is not reachable headlessly without a production hook
    // (a synced DOM mirror or a window-exposed store) — out of scope for a
    // test-only PR. The save/load roundtrip below exercises the wave *value*
    // through the save service as a proxy. Deferred deliberately, not skipped for
    // flake.
    test.fixme("wave starts: HUD wave readout appears/increments", async () => {
        // Needs either a data-testid mirror of state.game.wave in the React
        // HUD, or `window.store` exposed in dev/test builds. Tracked for a
        // follow-up that adds a minimal, flagged production hook.
    });

    // ── Flow 4: save/load roundtrip ──────────────────────────────────────────
    test("save/load roundtrip: a seeded save is restored from localStorage", async ({ page }) => {
        const slot = "slot_a";
        const WAVE = 7;
        const COINS = 1234;

        // Seed a save before the app loads. The Save menu's readAllSaves() reads
        // this slot from localStorage on first render — this is exactly the shape
        // writeSave() persists (Redux root state under `.game`).
        await seedSave(page, slot, makeSave(slot, "Mage", WAVE, COINS));

        await page.goto("/");
        await expectGameCanvas(page);

        // The boot overlay is the save picker, which lists every slot. A populated
        // slot renders the saved character plus a "Load" button (empty slots show
        // "Select"), so no extra navigation is needed. Key off the menu shell (the
        // save menu's derived id contains a space — see Flow 1).
        await expect(page.locator('[data-testid="menu-container"]')).toBeVisible();

        // The seeded slot surfaces the persisted wave/coins straight from the
        // save service — proof the localStorage roundtrip survived a fresh load.
        await expect(page.getByText(`Wave: ${WAVE}`)).toBeVisible();
        await expect(page.getByText(`Gold: ${COINS}`)).toBeVisible();

        // Loading the save dispatches loadGame + selectCharacter, which closes the
        // overlay (showUi:false) and drops us into the restored run.
        await page.getByRole("button", { name: "Load" }).first().click();
        // The overlay tears down (showUi:false) — no menu shell remains.
        await expect(page.locator('[data-testid="menu-container"]')).toHaveCount(0);

        // And the underlying localStorage save is unchanged after the roundtrip.
        const persisted = await page.evaluate((key) => window.localStorage.getItem(key), slot);
        expect(persisted).not.toBeNull();
        expect(JSON.parse(persisted as string).game.wave).toBe(WAVE);
    });
});
