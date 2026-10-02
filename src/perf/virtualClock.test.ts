import { describe, it, expect } from "vitest";
import { installVirtualDateNow } from "./virtualClock";

describe("installVirtualDateNow", () => {
    it("holds Date.now still until advanced, then restores it", () => {
        const original = Date.now;
        const clock = installVirtualDateNow(1000);
        expect(Date.now()).toBe(1000);
        expect(Date.now()).toBe(1000);

        clock.advance(1000 / 60);
        expect(Date.now()).toBeCloseTo(1016.667, 3);
        expect(clock.now()).toBe(Date.now());

        clock.restore();
        expect(Date.now).toBe(original);
    });
});
