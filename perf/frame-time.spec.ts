import { test } from "@playwright/test";
import { execSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import type {
    PerfReport,
    PerfResult,
    PerfScenarioName,
    PerfScenarioOptions,
} from "../src/perf/types";
import { enterBiome } from "./helpers";

// Frame-time matrix (#526). Every scenario boots a fresh page, drops a Warrior
// into the default biome via the "combat" start location, and hands the scene
// to the in-game harness (`window.__perf`, perf builds only). Results go to
// perf-results/, one JSON per scenario plus summary.json for perf-compare.
//
// Tunable from the environment so a local run can be quick:
//   PERF_SCENARIOS=chase,combat  PERF_ENEMIES=15,30,50  PERF_SEED=1
//   PERF_WARMUP_FRAMES=120  PERF_SAMPLE_FRAMES=1200  PERF_CPU_THROTTLE=4
//
// Frames, not seconds (#527): each frame advances the game one fixed 1/60s
// step, so a run does identical work on a fast or slow machine and repeats.

const list = (value: string | undefined, fallback: string) =>
    (value ?? fallback)
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

const SCENARIOS = list(process.env.PERF_SCENARIOS, "chase,combat") as PerfScenarioName[];
const ENEMIES = list(process.env.PERF_ENEMIES, "15,30,50").map(Number);
const SEED = Number(process.env.PERF_SEED ?? 1);
const WARMUP_FRAMES = Number(process.env.PERF_WARMUP_FRAMES ?? 120);
const SAMPLE_FRAMES = Number(process.env.PERF_SAMPLE_FRAMES ?? 1200);
// Chromium's CPU throttle, a rough stand-in for a phone's slower cores. It
// does not touch rendering, which headless Chromium does on the CPU anyway.
const CPU_THROTTLE = Number(process.env.PERF_CPU_THROTTLE ?? 4);
const OUT_DIR = path.resolve(process.env.PERF_OUT_DIR ?? "perf-results");

const results: PerfResult[] = [];
let user_agent = "";

function commit(): string | null {
    if (process.env.GITHUB_SHA) return process.env.GITHUB_SHA;
    try {
        return execSync("git rev-parse HEAD", { stdio: ["ignore", "pipe", "ignore"] })
            .toString()
            .trim();
    } catch {
        return null;
    }
}

test.describe("perf: frame time", () => {
    test.afterAll(() => {
        const report: PerfReport = {
            createdAt: new Date().toISOString(),
            commit: commit(),
            cpuThrottle: CPU_THROTTLE,
            userAgent: user_agent,
            results,
        };
        mkdirSync(OUT_DIR, { recursive: true });
        writeFileSync(path.join(OUT_DIR, "summary.json"), JSON.stringify(report, null, 2));
    });

    for (const scenario of SCENARIOS) {
        for (const enemies of ENEMIES) {
            test(`${scenario} × ${enemies}`, async ({ page }) => {
                // Throttled frames can run 4-6x the 16.7ms budget.
                test.setTimeout((WARMUP_FRAMES + SAMPLE_FRAMES) * 250 + 120_000);
                await enterBiome(page);
                user_agent = await page.evaluate(() => navigator.userAgent);

                const cdp = await page.context().newCDPSession(page);
                await cdp.send("Emulation.setCPUThrottlingRate", { rate: CPU_THROTTLE });

                const options: PerfScenarioOptions = {
                    scenario,
                    enemies,
                    seed: SEED,
                    warmupFrames: WARMUP_FRAMES,
                    sampleFrames: SAMPLE_FRAMES,
                };
                const result = await page.evaluate((opts) => {
                    if (!window.__perf) throw Error("perf harness missing: not a perf build?");
                    return window.__perf.run(opts);
                }, options);

                await cdp.send("Emulation.setCPUThrottlingRate", { rate: 1 });
                results.push(result);
                mkdirSync(OUT_DIR, { recursive: true });
                writeFileSync(
                    path.join(OUT_DIR, `${scenario}-${enemies}.json`),
                    JSON.stringify(result, null, 2)
                );

                const { frame, work, counts } = result;
                console.log(
                    `${scenario} × ${enemies}: frame p50 ${frame.p50} p95 ${frame.p95} ` +
                        `p99 ${frame.p99} max ${frame.max} ms · work p95 ${work.p95} ms · ` +
                        `${counts.end.enemies} enemies, ${counts.end.bodies} bodies`
                );
            });
        }
    }
});
