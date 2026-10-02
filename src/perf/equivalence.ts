import type { PerfAggregates, ReplayCheckpoint } from "./types";

// Golden comparison for the gameplay-equivalence net (#527). Pure, so the
// Playwright spec and the unit tests share it.

// Exact mode: every checkpoint hash must match. Returns one line per mismatch.
export function compareExact(
    golden: readonly ReplayCheckpoint[],
    actual: readonly ReplayCheckpoint[]
): string[] {
    const failures: string[] = [];
    if (golden.length !== actual.length) {
        failures.push(`checkpoint count ${actual.length}, golden ${golden.length}`);
    }
    golden.forEach((expected, i) => {
        const got = actual[i];
        if (!got) return;
        if (got.tick !== expected.tick) {
            failures.push(`checkpoint ${i}: tick ${got.tick}, golden ${expected.tick}`);
        } else if (got.hash !== expected.hash) {
            failures.push(`tick ${got.tick}: hash ${got.hash}, golden ${expected.hash}`);
        }
    });
    return failures;
}

// Tolerance mode, for stories allowed to shift AI decision timing (#537): the
// run's final outcomes must land within ±tolerance (a fraction) of the golden.
export function compareTolerance(
    golden: PerfAggregates,
    actual: PerfAggregates,
    tolerance: number
): string[] {
    return (Object.keys(golden) as (keyof PerfAggregates)[]).flatMap((key) => {
        const expected = golden[key];
        const got = actual[key];
        const allowed = Math.abs(expected) * tolerance;
        if (Math.abs(got - expected) <= allowed) return [];
        return [`${key}: ${got}, golden ${expected} (±${(tolerance * 100).toFixed(0)}%)`];
    });
}
