import { describe, it, expect } from "vitest";
import { getResourceColour } from "./getResourceColour";

describe("getResourceColour", () => {
    it("maps known resource names to colours (case-insensitive)", () => {
        expect(getResourceColour("health")).toBe("green");
        expect(getResourceColour("Health")).toBe("green");
        expect(getResourceColour("MANA")).toBe("blue");
        expect(getResourceColour("rage")).toBe("red");
        expect(getResourceColour("Energy")).toBe("yellow");
    });

    it("falls back to white for unknown resource types", () => {
        expect(getResourceColour("unknown")).toBe("white");
        expect(getResourceColour("")).toBe("white");
    });
});
