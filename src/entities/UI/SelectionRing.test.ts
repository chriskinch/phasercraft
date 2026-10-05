import { describe, it, expect, vi } from "vitest";
import { Scenes, type Scene } from "phaser";
import SelectionRing, { type RingOwner } from "./SelectionRing";

// Fake scene and containers at the entity seam.
function fakeGraphics(scene: object) {
    const g = {
        scene: scene as object | undefined,
        scaleY: 1,
        visible: false,
        clear: vi.fn(() => g),
        lineStyle: vi.fn(() => g),
        strokeCircle: vi.fn(() => g),
        setDepth: vi.fn(() => g),
        setVisible: vi.fn((value: boolean) => ((g.visible = value), g)),
        destroy: vi.fn(() => {
            g.scene = undefined;
        }),
    };
    return g;
}

function makeScene() {
    const made: ReturnType<typeof fakeGraphics>[] = [];
    const scene = {
        events: { once: vi.fn() },
        make: {
            graphics: vi.fn(() => {
                const g = fakeGraphics(scene);
                made.push(g);
                return g;
            }),
        },
    };
    return { scene, made, asScene: scene as unknown as Scene };
}

const owner = (width: number, height: number) =>
    ({ width, height, addAt: vi.fn() }) as unknown as RingOwner & {
        addAt: ReturnType<typeof vi.fn>;
    };

describe("SelectionRing", () => {
    it("is one ring per scene, released on SHUTDOWN", () => {
        const { scene, asScene } = makeScene();
        const ring = SelectionRing.for(asScene);
        expect(SelectionRing.for(asScene)).toBe(ring);
        expect(scene.events.once).toHaveBeenCalledWith(Scenes.Events.SHUTDOWN, ring.cleanup, ring);
    });

    it("draws the per-enemy ring's stroke at the bottom of the owner's container", () => {
        const { made, asScene } = makeScene();
        const enemy = owner(24, 32);

        SelectionRing.for(asScene).attach(enemy);

        const [g] = made;
        expect(g.scaleY).toBe(0.5);
        expect(g.lineStyle).toHaveBeenCalledWith(4, 0xb93f3c, 0.9);
        expect(g.strokeCircle).toHaveBeenCalledWith(0, 16 + 5, 12 + 5);
        expect(g.setDepth).toHaveBeenCalledWith(10);
        expect(g.visible).toBe(true);
        expect(enemy.addAt).toHaveBeenCalledWith(g, 0);
    });

    it("moves the same ring to the next owner, redrawn to its size", () => {
        const { made, asScene } = makeScene();
        const ring = SelectionRing.for(asScene);
        const first = owner(24, 32);
        const second = owner(40, 40);

        ring.attach(first);
        ring.detach(first);
        ring.attach(second);

        expect(made).toHaveLength(1);
        expect(made[0].clear).toHaveBeenCalledTimes(2);
        expect(made[0].strokeCircle).toHaveBeenLastCalledWith(0, 25, 25);
        expect(second.addAt).toHaveBeenCalledWith(made[0], 0);
    });

    it("only hides for the owner that holds it", () => {
        const { made, asScene } = makeScene();
        const ring = SelectionRing.for(asScene);
        const held = owner(24, 32);

        ring.attach(held);
        ring.detach(owner(10, 10));
        expect(made[0].visible).toBe(true);

        ring.detach(held);
        expect(made[0].visible).toBe(false);
    });

    it("draws a new ring when the last owner destroyed it with its container", () => {
        const { made, asScene } = makeScene();
        const ring = SelectionRing.for(asScene);

        ring.attach(owner(24, 32));
        made[0].destroy();
        ring.attach(owner(24, 32));

        expect(made).toHaveLength(2);
    });

    it("cleanup destroys the ring once and starts afresh next time", () => {
        const { made, asScene } = makeScene();
        const ring = SelectionRing.for(asScene);
        ring.attach(owner(24, 32));

        ring.cleanup();
        ring.cleanup();

        expect(made[0].destroy).toHaveBeenCalledTimes(1);
        expect(SelectionRing.for(asScene)).not.toBe(ring);
    });
});
