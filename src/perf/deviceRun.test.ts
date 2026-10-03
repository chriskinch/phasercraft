import { describe, it, expect, vi, afterEach } from "vitest";
import { copyJson, formatResult, parseDeviceRun } from "./deviceRun";
import type { FrameSummary, PerfCounts, PerfResult } from "./types";

describe("parseDeviceRun", () => {
    it("ignores URLs without a known scenario", () => {
        expect(parseDeviceRun("")).toBeNull();
        expect(parseDeviceRun("?perf=boss")).toBeNull();
        expect(parseDeviceRun("?enemies=15")).toBeNull();
    });

    it("fills CI defaults", () => {
        expect(parseDeviceRun("?perf=combat")).toEqual({
            scenario: "combat",
            enemies: 15,
            seed: 1,
            warmupFrames: 120,
            sampleFrames: 1200,
        });
    });

    it("reads overrides and rejects junk", () => {
        expect(parseDeviceRun("?perf=chase&enemies=50&frames=600&warmup=0&seed=3")).toEqual({
            scenario: "chase",
            enemies: 50,
            seed: 3,
            warmupFrames: 0,
            sampleFrames: 600,
        });
        expect(parseDeviceRun("?perf=chase&enemies=-2&frames=abc")).toMatchObject({
            enemies: 15,
            sampleFrames: 1200,
        });
    });
});

describe("formatResult", () => {
    it("prints frame, work and counts", () => {
        const summary: FrameSummary = {
            count: 10,
            mean: 16,
            p50: 16.7,
            p95: 33.3,
            p99: 50,
            max: 66.7,
            over16_7: 3,
            over33_3: 1,
            over50: 1,
        };
        const counts: PerfCounts = {
            enemies: 15,
            bodies: 32,
            timers: 34,
            tweens: 0,
            displayList: 70,
            gameObjects: 171,
            graphics: 54,
            texts: 2,
        };
        const result: PerfResult = {
            scenario: "combat",
            enemies: 15,
            seed: 1,
            sampleFrames: 1200,
            frame: summary,
            work: summary,
            counts: { end: counts, max: counts },
            heapMB: null,
        };
        expect(formatResult(result)).toBe(
            [
                "combat × 15  (1200 frames, seed 1)",
                "frame  p50 16.7  p95 33.3  p99 50  max 66.7  >16.7: 3  >50: 1",
                "work   p50 16.7  p95 33.3  p99 50  max 66.7  >16.7: 3  >50: 1",
                "bodies 32  timers 34  objects 171  graphics 54",
                "heap n/a",
            ].join("\n")
        );
    });
});

describe("copyJson", () => {
    const ui = () => ({ status: vi.fn(), textarea: vi.fn() });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it("reports a successful copy", async () => {
        const writeText = vi.fn().mockResolvedValue(undefined);
        vi.stubGlobal("navigator", { clipboard: { writeText } });
        const overlay = ui();
        copyJson(overlay, "{}");
        await Promise.resolve();
        await Promise.resolve();
        expect(writeText).toHaveBeenCalledWith("{}");
        expect(overlay.status).toHaveBeenCalledWith("Copied.");
        expect(overlay.textarea).not.toHaveBeenCalled();
    });

    it("falls back to a selectable box without a clipboard", () => {
        vi.stubGlobal("navigator", {});
        const overlay = ui();
        copyJson(overlay, "{}");
        expect(overlay.status).toHaveBeenCalledWith(
            "Clipboard unavailable: copy from the box below."
        );
        expect(overlay.textarea).toHaveBeenCalledWith("{}");
    });

    it("falls back when the write is rejected", async () => {
        vi.stubGlobal("navigator", {
            clipboard: { writeText: vi.fn().mockRejectedValue(new Error("denied")) },
        });
        const overlay = ui();
        copyJson(overlay, "{}");
        await Promise.resolve();
        await Promise.resolve();
        expect(overlay.textarea).toHaveBeenCalledWith("{}");
    });
});
