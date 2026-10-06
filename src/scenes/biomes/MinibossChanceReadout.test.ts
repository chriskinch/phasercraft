import { describe, it, expect, vi } from "vitest";
import type { GameObjects, Scene } from "phaser";
import MinibossChanceReadout, { minibossReadoutText } from "./MinibossChanceReadout";
import type { MinibossDebugView } from "./SpawnDirector";

// The readout is one BitmapText, faked at the scene seam.

function fakeText() {
    const t = {
        text: "",
        setTint: vi.fn(() => t),
        setOrigin: vi.fn(() => t),
        setScrollFactor: vi.fn(() => t),
        setDepth: vi.fn(() => t),
        setPosition: vi.fn(() => t),
        setText: vi.fn((value: string) => {
            t.text = value;
            return t;
        }),
        destroy: vi.fn(),
    };
    return t;
}

function makeReadout(view: Partial<MinibossDebugView> = {}) {
    const text = fakeText();
    const scene = { add: { bitmapText: vi.fn(() => text) } };
    let current: MinibossDebugView = {
        active: false,
        chance: 0.02,
        cellsExplored: 0,
        cellsToCertain: 50,
        ...view,
    };
    const readout = new MinibossChanceReadout(scene as unknown as Scene, {
        minibossDebugView: () => current,
    });
    const set = (next: Partial<MinibossDebugView>) => (current = { ...current, ...next });
    return { readout, text, scene, set };
}

describe("minibossReadoutText", () => {
    it("shows the next cell's chance and the count towards the guarantee", () => {
        expect(
            minibossReadoutText({
                active: false,
                chance: 0.02,
                cellsExplored: 12,
                cellsToCertain: 50,
            })
        ).toBe("Miniboss 2% - 12/50 cells");
    });

    it("reads 100% on the guaranteed cell", () => {
        expect(
            minibossReadoutText({ active: false, chance: 1, cellsExplored: 49, cellsToCertain: 50 })
        ).toBe("Miniboss 100% - 49/50 cells");
    });

    it("keeps one decimal for fractional percentages", () => {
        expect(
            minibossReadoutText({
                active: false,
                chance: 0.025,
                cellsExplored: 0,
                cellsToCertain: 50,
            })
        ).toBe("Miniboss 2.5% - 0/50 cells");
    });

    it("says the miniboss is up while one is active", () => {
        expect(
            minibossReadoutText({ active: true, chance: 0, cellsExplored: 7, cellsToCertain: 50 })
        ).toBe("MINIBOSS UP");
    });
});

describe("MinibossChanceReadout", () => {
    it("is pinned to the camera, above the HUD", () => {
        const { text } = makeReadout();

        expect(text.setScrollFactor).toHaveBeenCalledWith(0);
        expect(text.setOrigin).toHaveBeenCalledWith(1, 0);
    });

    it("sits in the zone's top-right corner", () => {
        const { readout, text } = makeReadout();
        const zone = { x: 10, y: 20, width: 800, height: 600, originX: 0, originY: 0 };

        readout.layout(zone as unknown as GameObjects.Zone);

        expect(text.setPosition).toHaveBeenCalledWith(810, 20);
    });

    it("refreshes the text from the director each frame, only when it changes", () => {
        const { readout, text, set } = makeReadout();

        readout.draw();
        readout.draw();
        expect(text.setText).toHaveBeenCalledTimes(1);
        expect(text.text).toBe("Miniboss 2% - 0/50 cells");

        set({ active: true });
        readout.draw();
        expect(text.text).toBe("MINIBOSS UP");
    });

    it("destroys its text on cleanup, idempotently, and draws nothing after", () => {
        const { readout, text } = makeReadout();

        readout.cleanup();
        readout.cleanup();
        readout.draw();

        expect(text.destroy).toHaveBeenCalledTimes(1);
        expect(text.setText).not.toHaveBeenCalled();
    });
});
