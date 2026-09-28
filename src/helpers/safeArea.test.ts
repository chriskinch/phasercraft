import { describe, it, expect, afterEach } from "vitest";
import { readSafeAreaInsets, safeZoneRect } from "./safeArea";

describe("safeZoneRect", () => {
    it("applies only the padding when there are no insets", () => {
        expect(safeZoneRect(844, 390, 40, { top: 0, right: 0, bottom: 0, left: 0 })).toEqual({
            x: 40,
            y: 40,
            width: 764,
            height: 310,
        });
    });

    it("shrinks the zone by each inset before padding", () => {
        expect(safeZoneRect(844, 390, 40, { top: 0, right: 0, bottom: 21, left: 47 })).toEqual({
            x: 87,
            y: 40,
            width: 717,
            height: 289,
        });
    });
});

describe("readSafeAreaInsets", () => {
    afterEach(() => {
        document.documentElement.removeAttribute("style");
    });

    it("reads the --safe-area-* custom properties as px numbers", () => {
        const root = document.documentElement.style;
        root.setProperty("--safe-area-left", "47px");
        root.setProperty("--safe-area-bottom", "21px");
        expect(readSafeAreaInsets()).toEqual({ top: 0, right: 0, bottom: 21, left: 47 });
    });

    it("reads 0 when the properties are unset", () => {
        expect(readSafeAreaInsets()).toEqual({ top: 0, right: 0, bottom: 0, left: 0 });
    });
});
