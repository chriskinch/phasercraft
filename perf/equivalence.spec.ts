import { expect, test } from "@playwright/test";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { compareExact, compareTolerance } from "../src/perf/equivalence";
import type { EquivalenceGoldens, PerfPrepareOptions, ReplayCheckpoint } from "../src/perf/types";
import { enterBiome } from "./helpers";

// Gameplay-equivalence net (#527). Each scenario replays a seeded, fixed-step
// run with the frame loop asleep and hashes the world (player, every enemy's
// position/health/state, loot on the ground) at fixed checkpoints. Perf
// stories must leave every hash unchanged.
//
//   PERF_EQUIVALENCE=exact      (default) hashes must match the goldens
//   PERF_EQUIVALENCE=tolerance  final kills/damage/attacks within
//                               ±PERF_TOLERANCE (default 0.1) of the goldens;
//                               for stories allowed to shift AI timing (#537)
//   PERF_EQUIVALENCE=update     rewrite the goldens; only when a change is
//                               meant to alter gameplay, and say so in the PR
//   PERF_GOLDENS=<path>         goldens file (default perf/goldens/equivalence.json)
//
// Screenshots, rendered at each checkpoint, are compared run against run
// rather than against committed images, because the pixels depend on the
// browser build. PERF_SNAPSHOTS=record writes them to PERF_SNAPSHOT_DIR (CI does
// this on the PR's base), PERF_SNAPSHOTS=compare checks a run against them
// pixel for pixel, unset skips them.

interface Scenario {
    name: string;
    options: PerfPrepareOptions;
    ticks: number;
    every: number;
}

const SCENARIOS: Scenario[] = [
    {
        name: "chase-15",
        options: { scenario: "chase", enemies: 15, seed: 1 },
        ticks: 900,
        every: 300,
    },
    {
        name: "combat-15",
        options: { scenario: "combat", enemies: 15, seed: 1 },
        ticks: 1800,
        every: 300,
    },
    {
        name: "combat-50",
        options: { scenario: "combat", enemies: 50, seed: 2 },
        ticks: 1200,
        every: 300,
    },
];

const MODE = process.env.PERF_EQUIVALENCE ?? "exact";
const TOLERANCE = Number(process.env.PERF_TOLERANCE ?? 0.1);
const GOLDENS = path.resolve(process.env.PERF_GOLDENS ?? "perf/goldens/equivalence.json");
const SNAPSHOTS = process.env.PERF_SNAPSHOTS;

const read = (): EquivalenceGoldens =>
    existsSync(GOLDENS) ? (JSON.parse(readFileSync(GOLDENS, "utf8")) as EquivalenceGoldens) : {};
const updated: EquivalenceGoldens = {};

test.describe("perf: gameplay equivalence", () => {
    test.afterAll(() => {
        if (MODE !== "update") return;
        mkdirSync(path.dirname(GOLDENS), { recursive: true });
        writeFileSync(GOLDENS, JSON.stringify({ ...read(), ...updated }, null, 2) + "\n");
    });

    for (const { name, options, ticks, every } of SCENARIOS) {
        test(name, async ({ page }) => {
            test.setTimeout(240_000);
            await enterBiome(page);
            await page.evaluate((opts) => window.__perf!.prepare(opts), options);

            const canvas = page.locator("#phaser-game canvas");
            const checkpoints: ReplayCheckpoint[] = [];
            for (let tick = every; tick <= ticks; tick += every) {
                checkpoints.push(await page.evaluate((n) => window.__perf!.advance(n), every));
                const shot = `${name}-${tick}.png`;
                if (SNAPSHOTS === "record") {
                    await canvas.screenshot({ path: test.info().snapshotPath(shot) });
                } else if (SNAPSHOTS === "compare") {
                    await expect(canvas).toHaveScreenshot(shot, { maxDiffPixels: 0 });
                }
            }
            await page.evaluate(() => window.__perf!.finish());

            if (MODE === "update") {
                updated[name] = checkpoints;
                return;
            }

            const golden = read()[name];
            expect(golden, `no golden for ${name}: run with PERF_EQUIVALENCE=update`).toBeDefined();
            const failures =
                MODE === "tolerance"
                    ? compareTolerance(
                          golden[golden.length - 1].aggregates,
                          checkpoints[checkpoints.length - 1].aggregates,
                          TOLERANCE
                      )
                    : compareExact(golden, checkpoints);
            expect(failures, `${name} diverged from the goldens`).toEqual([]);
        });
    }
});
