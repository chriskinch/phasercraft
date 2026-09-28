import { describe, it, expect } from "vitest";
import { hudInsets, safeZoneRect, getHudInsets, watchHudInsets } from "./safeArea";

const none = { top: 0, right: 0, bottom: 0, left: 0 };

describe("safeZoneRect", () => {
    it("applies only the padding when there are no insets", () => {
        expect(safeZoneRect(844, 390, 40, none)).toEqual({
            x: 40,
            y: 40,
            width: 764,
            height: 310,
        });
    });

    it("shrinks the zone by each inset before padding", () => {
        expect(safeZoneRect(844, 390, 40, { top: 0, right: 47, bottom: 21, left: 47 })).toEqual({
            x: 87,
            y: 40,
            width: 670,
            height: 289,
        });
    });
});

describe("hudInsets", () => {
    it("mirrors the larger horizontal inset onto both sides", () => {
        expect(hudInsets({ top: 0, right: 0, bottom: 21, left: 47 }, none)).toEqual({
            top: 0,
            right: 47,
            bottom: 21,
            left: 47,
        });
    });

    it("does not change when the notch swaps sides (180° rotation)", () => {
        const settled = hudInsets({ top: 0, right: 0, bottom: 21, left: 47 }, none);
        expect(hudInsets({ top: 0, right: 47, bottom: 21, left: 0 }, settled)).toEqual(settled);
    });

    it("never shrinks when the insets transiently read as 0", () => {
        const settled = hudInsets({ top: 0, right: 0, bottom: 21, left: 47 }, none);
        expect(hudInsets(none, settled)).toEqual(settled);
    });

    it("grows when a late, larger inset arrives", () => {
        const early = { top: 0, right: 20, bottom: 0, left: 20 };
        expect(hudInsets({ top: 0, right: 0, bottom: 21, left: 47 }, early)).toEqual({
            top: 0,
            right: 47,
            bottom: 21,
            left: 47,
        });
    });
});

describe("watcher", () => {
    it("reads no insets outside a notched device and releases listeners", () => {
        expect(getHudInsets()).toEqual(none);
        let calls = 0;
        const unwatch = watchHudInsets(() => calls++);
        unwatch();
        unwatch();
        expect(calls).toBe(0);
    });
});
