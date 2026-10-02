import type { FrameSummary, PerfCounts } from "./types";

const round = (value: number): number => Math.round(value * 100) / 100;

// Nearest-rank percentile over an ascending-sorted array.
export function percentile(sorted: readonly number[], p: number): number {
    if (sorted.length === 0) return 0;
    const rank = Math.ceil((p / 100) * sorted.length);
    return sorted[Math.min(Math.max(rank, 1), sorted.length) - 1];
}

export function summarizeFrames(samples: readonly number[]): FrameSummary {
    const sorted = [...samples].sort((a, b) => a - b);
    const total = sorted.reduce((sum, value) => sum + value, 0);
    const over = (budget: number) => sorted.filter((value) => value > budget).length;
    return {
        count: sorted.length,
        mean: round(sorted.length ? total / sorted.length : 0),
        p50: round(percentile(sorted, 50)),
        p95: round(percentile(sorted, 95)),
        p99: round(percentile(sorted, 99)),
        max: round(sorted.length ? sorted[sorted.length - 1] : 0),
        over16_7: over(1000 / 60),
        over33_3: over(1000 / 30),
        over50: over(50),
    };
}

// Field-wise maximum, for the peak counts seen during a run.
export function maxCounts(a: PerfCounts, b: PerfCounts): PerfCounts {
    const out = { ...a };
    (Object.keys(b) as (keyof PerfCounts)[]).forEach((key) => {
        out[key] = Math.max(a[key], b[key]);
    });
    return out;
}
