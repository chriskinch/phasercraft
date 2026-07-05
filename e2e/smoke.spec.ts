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
// Boot sequence the specs rely on (see src/scenes/LoadScene.ts and #377):
//   LoadScene.create() dispatches toggleUi("menu") and starts SelectScene, so
//   the Main Menu overlay is the first interactive UI. From there "New Game"
//   opens the "Pick a Game Save" picker (empty slots offer "Select" ->
//   setSaveSlot + switchUi("select") -> "Character Select"), and "Load" (shown
//   only when a save exists) opens the picker in load mode. Picking a character
//   or loading a save dispatches selectCharacter, which sets showUi:false (the
//   overlay closes and the run begins). SelectScene is the passive listener that
//   starts GameScene once a character is set.

test.describe("Phasercraft smoke", () => {
    // ── Flow 1: game boots ───────────────────────────────────────────────────
    test("game boots: page mounts, canvas renders, main menu appears", async ({ page }) => {
        await page.goto("/");

        // The Phaser host div is always rendered by React.
        await expect(page.locator("#phaser-game")).toBeAttached();

        // Phaser injects a <canvas> once the engine initialises — the boot signal.
        const canvas = await expectGameCanvas(page);
        await expect(canvas).toBeAttached();

        // LoadScene.create() opens the Main Menu overlay once the scene boots and
        // preload completes. Key off the menu shell ([data-testid="menu-container"],
        // rendered only while a menu is open), the title, and the New Game action.
        await expect(page.locator('[data-testid="menu-container"]')).toBeVisible();
        await expect(page.getByRole("heading", { name: "Phasercraft" })).toBeVisible();
        await expect(page.getByRole("button", { name: "New Game" })).toBeVisible();
    });

    // ── Flow 2: new game -> character select ─────────────────────────────────
    test("new game: choosing a class closes the overlay and starts the run", async ({ page }) => {
        await page.goto("/");
        await expectGameCanvas(page);

        // From the main menu, "New Game" opens the save picker.
        await expect(page.locator('[data-testid="menu-container"]')).toBeVisible();
        await page.getByRole("button", { name: "New Game" }).click();

        // An empty slot's "Select" button opens character select. (The save menu's
        // derived id contains a space — UI.tsx builds it via title.replace(" ", "-"),
        // which swaps only the first space — so key off the Select button instead.)
        await page.getByRole("button", { name: "Select" }).first().click();

        // The Character Select menu renders ("Character Select" -> id "character-select");
        // assert a button per playable class as the stable signal.
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

        // With a save present, the main menu offers "Load", which opens the picker
        // in load mode (populated slots only).
        await expect(page.locator('[data-testid="menu-container"]')).toBeVisible();
        await page.getByRole("button", { name: "Load", exact: true }).click();

        // The seeded slot surfaces the persisted wave/coins straight from the
        // save service — proof the localStorage roundtrip survived a fresh load.
        await expect(page.getByText(`Wave: ${WAVE}`)).toBeVisible();
        await expect(page.getByText(`Gold: ${COINS}`)).toBeVisible();

        // Loading the save dispatches loadGame + selectCharacter, which closes the
        // overlay (showUi:false) and drops us into the restored run.
        await page.getByRole("button", { name: "Load", exact: true }).first().click();
        // The overlay tears down (showUi:false) — no menu shell remains.
        await expect(page.locator('[data-testid="menu-container"]')).toHaveCount(0);

        // And the underlying localStorage save is unchanged after the roundtrip.
        const persisted = await page.evaluate((key) => window.localStorage.getItem(key), slot);
        expect(persisted).not.toBeNull();
        expect(JSON.parse(persisted as string).game.wave).toBe(WAVE);
    });
});
