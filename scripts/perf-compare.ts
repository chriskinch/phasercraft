// Compares two perf reports (#526) and prints a Markdown table.
//
// Runs on Node 22 native type stripping (no tsx).
//
//   npm run perf:compare -- <base summary.json> <head summary.json>
//   npm run perf:compare -- <summary.json>          (one report, no deltas)
//
// Report only: always exits 0 once both files parse. Lower is better for every
// column, so a negative delta is an improvement.

import { readFileSync } from "node:fs";
import type { PerfReport, PerfResult } from "../src/perf/types";

const COLUMNS: { label: string; pick: (r: PerfResult) => number }[] = [
    { label: "frame p50", pick: (r) => r.frame.p50 },
    { label: "frame p95", pick: (r) => r.frame.p95 },
    { label: "frame p99", pick: (r) => r.frame.p99 },
    { label: "frames >50ms", pick: (r) => r.frame.over50 },
    { label: "work p50", pick: (r) => r.work.p50 },
    { label: "work p95", pick: (r) => r.work.p95 },
    { label: "bodies", pick: (r) => r.counts.max.bodies },
    { label: "timers", pick: (r) => r.counts.max.timers },
    { label: "objects", pick: (r) => r.counts.max.gameObjects },
    { label: "graphics", pick: (r) => r.counts.max.graphics },
    { label: "colliders", pick: (r) => r.counts.max.colliders },
    { label: "loot", pick: (r) => r.counts.max.loot },
];

const key = (r: PerfResult) => `${r.scenario} × ${r.enemies}`;

function read(file: string): PerfReport {
    return JSON.parse(readFileSync(file, "utf8")) as PerfReport;
}

function cell(head: number, base?: number): string {
    if (base === undefined) return `${head}`;
    if (base === 0) return head === 0 ? "0" : `${head} (new)`;
    const delta = ((head - base) / base) * 100;
    const sign = delta > 0 ? "+" : "";
    return `${head} (${sign}${delta.toFixed(0)}%)`;
}

function main(): void {
    const args = process.argv.slice(2);
    if (args.length < 1 || args.length > 2) {
        console.error("usage: perf-compare <base.json> [head.json]");
        process.exit(1);
    }
    const head = read(args[args.length - 1]);
    const base = args.length === 2 ? read(args[0]) : null;
    const base_by_key = new Map((base?.results ?? []).map((r) => [key(r), r]));

    const short = (sha: string | null) => (sha ? sha.slice(0, 7) : "unknown");
    console.log(
        base
            ? `### Perf: \`${short(head.commit)}\` vs \`${short(base.commit)}\` (CPU ×${head.cpuThrottle}, ms; lower is better)`
            : `### Perf: \`${short(head.commit)}\` (CPU ×${head.cpuThrottle}, ms)`
    );
    console.log("");
    console.log(`| scenario | ${COLUMNS.map((c) => c.label).join(" | ")} |`);
    console.log(`| --- | ${COLUMNS.map(() => "---:").join(" | ")} |`);
    head.results.forEach((result) => {
        const prior = base_by_key.get(key(result));
        const cells = COLUMNS.map((c) => cell(c.pick(result), prior ? c.pick(prior) : undefined));
        console.log(`| ${key(result)} | ${cells.join(" | ")} |`);
    });
    console.log("");
    console.log(
        "_frame = rAF interval; work = Phaser step + render. Headless renders on the CPU, so render wins show on device._"
    );
}

main();
