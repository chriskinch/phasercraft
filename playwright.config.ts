import { defineConfig, devices } from "@playwright/test";

// Phasercraft E2E configuration (Phase 4, #309).
//
// The app is a Next 15 *static export* — `npm run build` emits the site to
// `dist/`. We serve that built output with a plain static server and point
// Playwright at it; there is no runtime Next server in production, so testing
// the static export is the closest thing to "production" we can drive.
//
// Two test layers share this config, split by Playwright *project*:
//   - `smoke`   : the fast pack that runs on every PR (Chromium only).
//   - `firefox` / `webkit` : extra browser coverage for the nightly full run.
// CI selects a project with `--project=<name>` (see .github/workflows/e2e.yml).

const PORT = Number(process.env.PLAYWRIGHT_PORT ?? 3000);
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? `http://localhost:${PORT}`;
const isCI = !!process.env.CI;

export default defineConfig({
    testDir: "./e2e",
    // Fail the build on a stray `test.only` left in source on CI.
    forbidOnly: isCI,
    // The game boots a Phaser canvas and loads assets, so give specs headroom.
    timeout: 60_000,
    expect: { timeout: 15_000 },
    // Flake guard on CI; locally a failure should fail fast for the author.
    retries: isCI ? 2 : 0,
    workers: isCI ? 1 : undefined,
    reporter: isCI ? [["github"], ["html", { open: "never" }]] : [["list"]],
    use: {
        baseURL,
        trace: "on-first-retry",
        screenshot: "only-on-failure",
        video: "retain-on-failure",
    },
    projects: [
        {
            name: "smoke",
            use: { ...devices["Desktop Chrome"] },
        },
        // Nightly-only extra browser coverage. The smoke job runs `--project=smoke`
        // so these never execute on PRs; the nightly job runs all projects.
        {
            name: "firefox",
            use: { ...devices["Desktop Firefox"] },
        },
        {
            name: "webkit",
            use: { ...devices["Desktop Safari"] },
        },
    ],
    // Serve the static export. `serve` is a devDependency so CI is deterministic
    // (no `npx` network fetch). `-s` enables SPA fallback; `-L` disables the
    // request logger. Reuse an already-running server locally for fast reruns.
    webServer: {
        command: `npx serve dist -s -L -l ${PORT}`,
        url: baseURL,
        reuseExistingServer: !isCI,
        timeout: 120_000,
    },
});
