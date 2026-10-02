import { defineConfig } from "@playwright/test";

// Perf harness (#526): frame-time scenarios against a `VITE_PERF=1` build in
// `dist-perf/`. Kept apart from playwright.config.ts so neither the smoke nor
// the nightly full E2E run picks these up. Report only: the specs record
// numbers, they never assert on them.

const PORT = Number(process.env.PERF_PORT ?? 3100);
const baseURL = `http://localhost:${PORT}`;

export default defineConfig({
    testDir: "./perf",
    // One scenario at a time on one worker: parallel runs would fight for the
    // CPU and skew each other's numbers.
    workers: 1,
    fullyParallel: false,
    retries: 0,
    // Per-scenario timeouts are set in the spec from the sample length.
    timeout: 0,
    reporter: [["list"]],
    use: {
        baseURL,
        // A flagship phone held landscape (CSS px). The canvas tracks the
        // viewport, so this also sets the spawn radius and the render area.
        viewport: { width: 915, height: 412 },
        // The PWA service worker would precache ~5MB of assets mid-run.
        serviceWorkers: "block",
        browserName: "chromium",
        // Point at a preinstalled Chromium instead of Playwright's download.
        launchOptions: process.env.PERF_CHROMIUM_PATH
            ? { executablePath: process.env.PERF_CHROMIUM_PATH }
            : {},
    },
    webServer: {
        command: `npx serve dist-perf -s -L -l ${PORT}`,
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
    },
});
