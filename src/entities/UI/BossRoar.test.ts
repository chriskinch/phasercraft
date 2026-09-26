import { describe, it, expect, vi } from "vitest";
import type { Scene } from "phaser";
import BossRoar, { roarPosition, ROAR_ABOVE_BOSS, ROAR_EDGE_MARGIN } from "./BossRoar";

// roarPosition is pure screen geometry; BossRoar itself is tested against a
// fake scene at the entity seam (text, tween chain and the scene emitter).

const view = { width: 800, height: 600 };
const player = { x: 400, y: 300 };
// Inset per axis: wider than tall, like the word.
const pad = { x: 70, y: 40 };

describe("roarPosition", () => {
    // Each boss sits far off screen in one of the eight directions; the word
    // lands where that direction meets the padded edge.
    it.each([
        ["right", { x: 2000, y: 300 }, { x: 800 - pad.x, y: 300 }],
        ["left", { x: -2000, y: 300 }, { x: pad.x, y: 300 }],
        ["below", { x: 400, y: 2000 }, { x: 400, y: 600 - pad.y }],
        ["above", { x: 400, y: -2000 }, { x: 400, y: pad.y }],
    ])("sits on the padded edge when the boss is %s", (_, boss, expected) => {
        const at = roarPosition(view, player, boss, pad);
        expect(at.x).toBeCloseTo(expected.x);
        expect(at.y).toBeCloseTo(expected.y);
    });

    it.each([
        ["up-right", { x: 2000, y: -1300 }],
        ["up-left", { x: -1200, y: -1300 }],
        ["down-right", { x: 2000, y: 1900 }],
        ["down-left", { x: -1200, y: 1900 }],
    ])("stays on the player→boss line and inside the padded edge (%s)", (_, boss) => {
        const at = roarPosition(view, player, boss, pad);

        // Inside the inset rect, touching at least one of its edges.
        expect(at.x).toBeGreaterThanOrEqual(pad.x - 1e-9);
        expect(at.x).toBeLessThanOrEqual(800 - pad.x + 1e-9);
        expect(at.y).toBeGreaterThanOrEqual(pad.y - 1e-9);
        expect(at.y).toBeLessThanOrEqual(600 - pad.y + 1e-9);
        const on_edge = [at.x - pad.x, 800 - pad.x - at.x, at.y - pad.y, 600 - pad.y - at.y].some(
            (d) => Math.abs(d) < 1e-6
        );
        expect(on_edge).toBe(true);

        // Same bearing as the boss, seen from the player.
        const bearing = (p: { x: number; y: number }) => Math.atan2(p.y - player.y, p.x - player.x);
        expect(bearing(at)).toBeCloseTo(bearing(boss));
    });

    describe("with the player inside the inset band (camera held at the map edge)", () => {
        // The real inset for a 120x50 word: half-size + margin, plus the rise.
        const band = { x: 76, y: 61 };

        it("still points at a boss nearly straight up, from near the right edge", () => {
            const at = roarPosition(view, { x: 780, y: 300 }, { x: 790, y: -500 }, band);

            expect(at.y).toBe(band.y); // top edge, not the bottom-right
            expect(at.x).toBe(800 - band.x);
        });

        it("still points at a boss up and to the right, from near the top edge", () => {
            const at = roarPosition(view, { x: 400, y: 20 }, { x: 900, y: -10 }, band);

            expect(at.x).toBe(800 - band.x); // right side, not the top-left
            expect(at.y).toBe(band.y);
        });

        it("pins to the nearest corner when past the band on both axes, heading out", () => {
            const at = roarPosition(view, { x: 790, y: 10 }, { x: 1500, y: -800 }, band);

            expect(at).toEqual({ x: 800 - band.x, y: band.y });
        });

        it("still hits the far edge when heading back across the screen", () => {
            const at = roarPosition(view, { x: 780, y: 300 }, { x: -2000, y: 300 }, band);

            expect(at).toEqual({ x: band.x, y: 300 });
        });
    });

    it("keeps the word on screen when an on-screen boss is near the top edge", () => {
        const at = roarPosition(view, player, { x: 650, y: 10 }, pad);

        expect(at).toEqual({ x: 650, y: pad.y });
    });

    it("goes just above the boss when the boss is already on screen", () => {
        expect(roarPosition(view, player, { x: 650, y: 200 }, pad)).toEqual({
            x: 650,
            y: 200 - ROAR_ABOVE_BOSS,
        });
    });
});

function makeScene() {
    const text = {
        width: 120,
        height: 50,
        once: vi.fn(),
        setPosition: vi.fn(() => text),
        off: vi.fn(),
        destroy: vi.fn(),
        setOrigin: vi.fn(() => text),
        setScrollFactor: vi.fn(() => text),
        setDepth: vi.fn(() => text),
        setAlpha: vi.fn(() => text),
    };
    const chain = { stop: vi.fn() };
    const scene = {
        events: { once: vi.fn(), off: vi.fn() },
        add: { text: vi.fn(() => text) },
        tweens: { chain: vi.fn(() => chain) },
    };
    return { scene, text, chain };
}

describe("BossRoar", () => {
    it("writes ROAR! in BoldPixels, white with a chunky black stroke, pinned to the camera", () => {
        const { scene, text } = makeScene();

        new BossRoar(scene as unknown as Scene, view, player, { x: 2000, y: 300 });

        const [, , word, style] = scene.add.text.mock.calls[0] as unknown as [
            number,
            number,
            string,
            Record<string, unknown>,
        ];
        expect(word).toBe("ROAR!");
        expect(style).toMatchObject({
            fontFamily: "BoldPixels",
            color: "#ffffff",
            stroke: "#000000",
        });
        expect(style.strokeThickness as number).toBeGreaterThanOrEqual(6);
        expect(text.setScrollFactor).toHaveBeenCalledWith(0);
        expect(text.setAlpha).toHaveBeenCalledWith(0);
    });

    it("fades in rising ~10px, holds 2s, then rises again while fading out", () => {
        const { scene, text } = makeScene();

        new BossRoar(scene as unknown as Scene, view, player, { x: 2000, y: 300 });

        const config = (scene.tweens.chain.mock.calls[0] as unknown[])[0] as {
            targets: unknown;
            tweens: Array<Record<string, number>>;
        };
        expect(config.targets).toBe(text);
        const [fade_in, fade_out] = config.tweens;
        expect(fade_in).toMatchObject({ alpha: 1, y: 290 });
        expect(fade_out).toMatchObject({ alpha: 0, y: 280, delay: 2000 });
    });

    it("insets by its own measured half-size so the edge never clips it", () => {
        const { scene, text } = makeScene();

        new BossRoar(scene as unknown as Scene, view, player, { x: 2000, y: 300 });

        // 120px wide text centred on the right edge: half its width plus the margin.
        expect(text.setPosition).toHaveBeenCalledWith(800 - 60 - ROAR_EDGE_MARGIN, 300);
    });

    it("removes itself once the animation completes", () => {
        const { scene, text, chain } = makeScene();
        new BossRoar(scene as unknown as Scene, view, player, { x: 2000, y: 300 });
        const { onComplete } = (scene.tweens.chain.mock.calls[0] as unknown[])[0] as {
            onComplete: () => void;
        };

        onComplete();

        expect(text.destroy).toHaveBeenCalledTimes(1);
        // stop() is a guarded no-op on a finished chain in Phaser.
        expect(chain.stop).toHaveBeenCalledTimes(1);
    });

    it("releases the tween and the text on scene shutdown", () => {
        const { scene, text, chain } = makeScene();
        const roar = new BossRoar(scene as unknown as Scene, view, player, { x: 2000, y: 300 });

        expect(scene.events.once).toHaveBeenCalledWith("shutdown", roar.cleanup, roar);
        roar.cleanup();

        expect(chain.stop).toHaveBeenCalledTimes(1);
        expect(text.destroy).toHaveBeenCalledTimes(1);
        expect(scene.events.off).toHaveBeenCalledWith("shutdown", roar.cleanup, roar);
    });

    it("does not destroy the text again when released by the text's own DESTROY", () => {
        // Phaser emits DESTROY before clearing the object's scene, so calling
        // destroy() again from the handler would run the teardown twice. This
        // is the scene-shutdown path: the display list destroys the text first.
        const { scene, text, chain } = makeScene();
        const roar = new BossRoar(scene as unknown as Scene, view, player, { x: 2000, y: 300 });
        const [event, onDestroy, context] = text.once.mock.calls[0] as unknown as [
            string,
            () => void,
            unknown,
        ];
        expect(event).toBe("destroy");

        onDestroy.call(context);

        expect(text.destroy).not.toHaveBeenCalled();
        expect(chain.stop).toHaveBeenCalledTimes(1);
        expect(scene.events.off).toHaveBeenCalledWith("shutdown", roar.cleanup, roar);

        // A later SHUTDOWN or completion has nothing left to release.
        roar.cleanup();
        expect(chain.stop).toHaveBeenCalledTimes(1);
        expect(text.destroy).not.toHaveBeenCalled();
    });

    it("is idempotent — cleanup after completion releases nothing twice", () => {
        const { scene, text, chain } = makeScene();
        const roar = new BossRoar(scene as unknown as Scene, view, player, { x: 2000, y: 300 });

        roar.cleanup();
        roar.cleanup();

        expect(chain.stop).toHaveBeenCalledTimes(1);
        expect(text.destroy).toHaveBeenCalledTimes(1);
    });
});
