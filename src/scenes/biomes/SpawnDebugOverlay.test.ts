import { describe, it, expect, vi } from "vitest";
import type { Scene } from "phaser";
import SpawnDebugOverlay, {
    coneEdges,
    countdownLabel,
    type OverlayEnemy,
} from "./SpawnDebugOverlay";
import type { SpawnDebugView } from "./SpawnDirector";

// The overlay draws onto a Graphics and a pool of Texts; both are faked at the
// scene seam, so these tests check what is drawn and what is released.

function fakeGraphics() {
    const g = {
        setDepth: vi.fn(() => g),
        clear: vi.fn(() => g),
        lineStyle: vi.fn(() => g),
        strokeCircle: vi.fn(() => g),
        lineBetween: vi.fn(() => g),
        beginPath: vi.fn(() => g),
        arc: vi.fn(() => g),
        strokePath: vi.fn(() => g),
        destroy: vi.fn(),
    };
    return g;
}

function fakeText() {
    const t = {
        text: "",
        visible: true,
        setOrigin: vi.fn(() => t),
        setDepth: vi.fn(() => t),
        setText: vi.fn((value: string) => {
            t.text = value;
            return t;
        }),
        setPosition: vi.fn(() => t),
        setVisible: vi.fn((value: boolean) => {
            t.visible = value;
            return t;
        }),
        destroy: vi.fn(),
    };
    return t;
}

function makeOverlay(view: Partial<SpawnDebugView<OverlayEnemy>> = {}) {
    const graphics = fakeGraphics();
    const texts: ReturnType<typeof fakeText>[] = [];
    const scene = {
        add: {
            graphics: vi.fn(() => graphics),
            text: vi.fn(() => {
                const t = fakeText();
                texts.push(t);
                return t;
            }),
        },
    };
    let current: SpawnDebugView<OverlayEnemy> = {
        radius: 300,
        direction: null,
        halfAngle: Math.PI / 4,
        despawnDelayMs: 20000,
        enemies: [],
        attempts: [],
        ...view,
    };
    const source = { debugView: vi.fn(() => current) };
    const overlay = new SpawnDebugOverlay(scene as unknown as Scene, source);
    const setView = (next: Partial<SpawnDebugView<OverlayEnemy>>) => {
        current = { ...current, ...next };
    };
    return { overlay, graphics, texts, scene, setView };
}

const player = { x: 1000, y: 1000 };

describe("coneEdges", () => {
    it("places both edges on the radius, either side of the direction", () => {
        const [a, b] = coneEdges({ x: 0, y: 0 }, { x: 1, y: 0 }, Math.PI / 4, 100);

        expect(a.x).toBeCloseTo(100 * Math.SQRT1_2);
        expect(a.y).toBeCloseTo(-100 * Math.SQRT1_2);
        expect(b.x).toBeCloseTo(100 * Math.SQRT1_2);
        expect(b.y).toBeCloseTo(100 * Math.SQRT1_2);
    });
});

describe("countdownLabel", () => {
    it("is null while the enemy is within range", () => {
        expect(countdownLabel(0, 20000)).toBeNull();
    });

    it("shows the seconds left to one decimal", () => {
        expect(countdownLabel(4500, 20000)).toBe("15.5s");
    });

    it("never goes below zero", () => {
        expect(countdownLabel(25000, 20000)).toBe("0.0s");
    });
});

describe("SpawnDebugOverlay.draw", () => {
    it("draws the radius around the player, thicker while standing still", () => {
        const { overlay, graphics } = makeOverlay({ direction: null });

        overlay.draw(player);

        expect(graphics.clear).toHaveBeenCalled();
        expect(graphics.strokeCircle).toHaveBeenCalledWith(1000, 1000, 300);
        expect(graphics.lineStyle).toHaveBeenCalledWith(4, expect.any(Number), expect.any(Number));
        expect(graphics.arc).not.toHaveBeenCalled();
    });

    it("draws the cone edges and arc when the player is moving", () => {
        const { overlay, graphics } = makeOverlay({ direction: { x: 1, y: 0 } });

        overlay.draw(player);

        expect(graphics.lineStyle).toHaveBeenCalledWith(2, expect.any(Number), expect.any(Number));
        expect(graphics.lineBetween).toHaveBeenCalledTimes(2);
        expect(graphics.arc).toHaveBeenCalledWith(1000, 1000, 300, -Math.PI / 4, Math.PI / 4);
    });

    it("marks each of the last spawn attempt's candidates", () => {
        const { overlay, graphics } = makeOverlay({
            attempts: [
                { point: { x: 1300, y: 1000 }, ok: false },
                { point: { x: 700, y: 1000 }, ok: true },
            ],
        });

        overlay.draw(player);

        // Two strokes per cross, and nothing for the cone (standing still).
        expect(graphics.lineBetween).toHaveBeenCalledTimes(4);
    });

    it("labels an enemy whose despawn clock is running, above its head", () => {
        const enemy = { x: 1400, y: 1000, height: 30 };
        const { overlay, texts } = makeOverlay({ enemies: [{ enemy, beyondMs: 5000 }] });

        overlay.draw(player);

        expect(texts).toHaveLength(1);
        expect(texts[0].text).toBe("15.0s");
        expect(texts[0].setPosition).toHaveBeenCalledWith(1400, 970);
    });

    it("hides the label while the enemy is back in range, and reuses it", () => {
        const enemy = { x: 1400, y: 1000, height: 30 };
        const { overlay, texts, setView } = makeOverlay({ enemies: [{ enemy, beyondMs: 5000 }] });
        overlay.draw(player);

        setView({ enemies: [{ enemy, beyondMs: 0 }] });
        overlay.draw(player);
        expect(texts[0].visible).toBe(false);

        setView({ enemies: [{ enemy, beyondMs: 1000 }] });
        overlay.draw(player);
        expect(texts).toHaveLength(1);
        expect(texts[0].visible).toBe(true);
    });

    it("destroys the label of an enemy that is no longer tracked", () => {
        const enemy = { x: 1400, y: 1000, height: 30 };
        const { overlay, texts, setView } = makeOverlay({ enemies: [{ enemy, beyondMs: 5000 }] });
        overlay.draw(player);

        setView({ enemies: [] });
        overlay.draw(player);

        expect(texts[0].destroy).toHaveBeenCalledTimes(1);
    });
});

describe("SpawnDebugOverlay.cleanup", () => {
    it("destroys the graphics and every label", () => {
        const enemy = { x: 1400, y: 1000, height: 30 };
        const { overlay, graphics, texts } = makeOverlay({ enemies: [{ enemy, beyondMs: 5000 }] });
        overlay.draw(player);

        overlay.cleanup();

        expect(graphics.destroy).toHaveBeenCalledTimes(1);
        expect(texts[0].destroy).toHaveBeenCalledTimes(1);
    });

    it("is idempotent, and drawing after cleanup does nothing", () => {
        const { overlay, graphics } = makeOverlay();

        overlay.cleanup();
        overlay.cleanup();
        overlay.draw(player);

        expect(graphics.destroy).toHaveBeenCalledTimes(1);
        expect(graphics.clear).not.toHaveBeenCalled();
    });
});
