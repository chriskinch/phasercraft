import { describe, it, expect } from "vitest";
import { animationKeys } from "./animationKeys";

describe("animationKeys", () => {
    it("names a creature's animations as config/animations.ts registers them", () => {
        expect(animationKeys("baby-ghoul")).toEqual({
            idle: "baby-ghoul-idle",
            death: "baby-ghoul-death",
            walkLeft: "baby-ghoul-left-down",
            walkRight: "baby-ghoul-right-up",
        });
    });

    it("builds them once per key, not once per call", () => {
        expect(animationKeys("imp")).toBe(animationKeys("imp"));
        expect(animationKeys("imp")).not.toBe(animationKeys("ghoul"));
    });
});
