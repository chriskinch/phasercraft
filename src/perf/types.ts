// Shared shapes for the perf harness (#526): what the Playwright perf spec asks
// the in-game harness to run, and the JSON it gets back. Imported by the
// harness, the spec and scripts/perf-compare.ts, so all three agree.

// "chase": the player stands still while every enemy chases and attacks.
// "combat": the player also fights back — auto-attacks the nearest enemy and
// presses every ready non-ground ability — and each kill is replaced, so the
// enemy count holds while corpses, loot, projectiles and combat text pile up.
export type PerfScenarioName = "chase" | "combat";

export interface PerfScenarioOptions {
    scenario: PerfScenarioName;
    enemies: number;
    seed: number;
    warmupMs: number;
    sampleMs: number;
}

// Frame-time distribution in ms. `over*` count frames above each budget.
export interface FrameSummary {
    count: number;
    mean: number;
    p50: number;
    p95: number;
    p99: number;
    max: number;
    over16_7: number;
    over33_3: number;
    over50: number;
}

// Live object counts in the biome scene.
export interface PerfCounts {
    enemies: number;
    bodies: number;
    timers: number;
    tweens: number;
    // Top-level display list entries, and every game object including
    // container children.
    displayList: number;
    gameObjects: number;
    graphics: number;
    texts: number;
}

export interface PerfResult {
    scenario: PerfScenarioName;
    enemies: number;
    seed: number;
    sampleMs: number;
    // rAF-to-rAF interval: what the player sees.
    frame: FrameSummary;
    // Phaser's own step + render time per game frame: headroom under the budget.
    work: FrameSummary;
    counts: { end: PerfCounts; max: PerfCounts };
    // Chromium-only (`performance.memory`); null elsewhere.
    heapMB: { start: number; end: number } | null;
}

// The in-page API a perf build exposes on `window.__perf`.
export interface PerfApi {
    // True once the biome scene is running with a player in it.
    ready(): boolean;
    run(options: PerfScenarioOptions): Promise<PerfResult>;
}

declare global {
    interface Window {
        __perf?: PerfApi;
    }
}

// One run of the whole matrix, as written to perf-results/summary.json.
export interface PerfReport {
    createdAt: string;
    commit: string | null;
    cpuThrottle: number;
    userAgent: string;
    results: PerfResult[];
}
