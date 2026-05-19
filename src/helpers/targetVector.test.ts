import { describe, it, expect } from "vitest";
import targetVector from "./targetVector";

// Minimal Phaser-like body shape sufficient for targetVector
function makeBody(x: number, y: number) {
    return {
        body: {
            position: {
                x,
                y,
                clone() {
                    return {
                        x,
                        y,
                        subtract(pos: { x: number; y: number }) {
                            return { x: x - pos.x, y: y - pos.y };
                        },
                    };
                },
            },
        },
    };
}

describe("targetVector", () => {
    it("computes the delta and range between two bodies", () => {
        const from = makeBody(0, 0);
        const to = makeBody(3, 4);
        const result = targetVector(from, to);
        expect(result.delta).toEqual({ x: 3, y: 4 });
        expect(result.range).toBeCloseTo(5);
    });

    it("returns range 0 when bodies are at the same position", () => {
        const from = makeBody(10, 10);
        const to = makeBody(10, 10);
        const result = targetVector(from, to);
        expect(result.range).toBe(0);
        expect(result.delta).toEqual({ x: 0, y: 0 });
    });
});
