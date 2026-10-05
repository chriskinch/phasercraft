// Shared shapes for the perf harness (#526): what the Playwright perf spec asks
// the in-game harness to run, and the JSON it gets back. Imported by the
// harness, the spec and scripts/perf-compare.ts, so all three agree.

// "chase": the player stands still while every enemy chases and attacks.
// "combat": the player also fights back — auto-attacks the nearest enemy and
// presses every ready non-ground ability — and each kill is replaced, so the
// enemy count holds while corpses, loot, projectiles and combat text pile up.
export type PerfScenarioName = "chase" | "combat";

// What a run sets up: the scene is restarted under the seed and driven at a
// fixed step, so the same options always produce the same world.
export interface PerfPrepareOptions {
    scenario: PerfScenarioName;
    enemies: number;
    seed: number;
}

// Frame-time runs count game frames, not seconds: every frame advances the
// simulation one fixed step, so a run does the same work however slow the
// machine is.
export interface PerfScenarioOptions extends PerfPrepareOptions {
    warmupFrames: number;
    sampleFrames: number;
}

// Cumulative outcomes since the run started (tolerance-mode comparison).
export interface PerfAggregates {
    kills: number;
    // Raw damage of every enemy attack that landed on the player.
    damageTaken: number;
    attacks: number;
}

export interface ReplayCheckpoint {
    tick: number;
    hash: string;
    aggregates: PerfAggregates;
}

// perf/goldens/equivalence.json: checkpoints per replay scenario.
export type EquivalenceGoldens = Record<string, ReplayCheckpoint[]>;

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
    // Arcade colliders and loot on the ground: grow over a long run if
    // anything leaks (loot never despawns; #542 10-minute run).
    colliders: number;
    loot: number;
}

export interface PerfResult {
    scenario: PerfScenarioName;
    enemies: number;
    seed: number;
    sampleFrames: number;
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
    // Frame-time run: prepare, measure on the real frame loop, finish.
    run(options: PerfScenarioOptions): Promise<PerfResult>;
    // Replay (#527): prepare, then advance in fixed steps with the frame loop
    // asleep. advance() renders only its last tick, so a screenshot taken
    // afterwards shows exactly that checkpoint. finish() hands the game back.
    prepare(options: PerfPrepareOptions): void;
    advance(ticks: number): ReplayCheckpoint;
    finish(): void;
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
