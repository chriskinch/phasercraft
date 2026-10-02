import type { Page } from "@playwright/test";
import "../src/perf/types";

// Same menu path as the smoke pack: New Game → empty slot → Warrior. The
// settings send a new game straight into the default biome, muted.
export async function enterBiome(page: Page): Promise<void> {
    await page.addInitScript(() => {
        window.localStorage.setItem(
            "settings",
            JSON.stringify({ godMode: true, startLocation: "combat", sfxVolume: 0 })
        );
    });
    await page.goto("/");
    await page.getByRole("button", { name: "New Game" }).click();
    await page.getByRole("button", { name: "Select" }).first().click();
    await page.getByRole("button", { name: "Warrior", exact: true }).click();
    await page.waitForFunction(() => window.__perf?.ready() === true, null, {
        timeout: 60_000,
    });
}
