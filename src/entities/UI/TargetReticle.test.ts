import { describe, it, expect, vi } from "vitest";
import { Scenes } from "phaser";
import TargetReticle from "./TargetReticle";

// Prototype-fake tests (no Phaser boot) for the ground-placement ring:
// visibility flow and the pointer-follow gate, plus listener cleanup.

interface GraphicsStub {
    clear: ReturnType<typeof vi.fn>;
    lineStyle: ReturnType<typeof vi.fn>;
    strokeCircle: ReturnType<typeof vi.fn>;
    setPosition: ReturnType<typeof vi.fn>;
    setAlpha: ReturnType<typeof vi.fn>;
    setVisible: ReturnType<typeof vi.fn>;
}

interface ReticleUnderTest {
    scene: {
        events: { off: ReturnType<typeof vi.fn> };
        input: { activePointer: { x: number; y: number } };
        cameras: { main: { getWorldPoint: ReturnType<typeof vi.fn> } };
        tweens: { add: ReturnType<typeof vi.fn> };
    };
    graphics: GraphicsStub;
    active: boolean;
    show(radius?: number): void;
    hide(): void;
    placeAt(point: { x: number; y: number }): void;
    onPointerMove(scene: unknown, pointer: { x: number; y: number }): void;
    cleanup(): void;
}

function makeReticle(): ReticleUnderTest {
    const reticle = Object.create(TargetReticle.prototype) as ReticleUnderTest;
    reticle.scene = {
        events: { off: vi.fn() },
        input: { activePointer: { x: 10, y: 20 } },
        cameras: { main: { getWorldPoint: vi.fn((x: number, y: number) => ({ x, y })) } },
        tweens: { add: vi.fn() },
    };
    reticle.graphics = {
        clear: vi.fn(),
        lineStyle: vi.fn(),
        strokeCircle: vi.fn(),
        setPosition: vi.fn(),
        setAlpha: vi.fn(),
        setVisible: vi.fn(),
    };
    reticle.active = false;
    return reticle;
}

describe("TargetReticle", () => {
    it("show draws the radius at the pointer and becomes visible", () => {
        const reticle = makeReticle();

        reticle.show(25);

        expect(reticle.graphics.strokeCircle).toHaveBeenCalledWith(0, 0, 25);
        expect(reticle.graphics.setPosition).toHaveBeenCalledWith(10, 20);
        expect(reticle.graphics.setVisible).toHaveBeenCalledWith(true);
        expect(reticle.active).toBe(true);
    });

    it("follows the pointer only while active", () => {
        const reticle = makeReticle();

        reticle.onPointerMove(null, { x: 50, y: 60 });
        expect(reticle.graphics.setPosition).not.toHaveBeenCalled();

        reticle.show();
        reticle.onPointerMove(null, { x: 50, y: 60 });
        expect(reticle.graphics.setPosition).toHaveBeenCalledWith(50, 60);
    });

    it("hide makes it invisible and stops following", () => {
        const reticle = makeReticle();
        reticle.show();

        reticle.hide();

        expect(reticle.active).toBe(false);
        expect(reticle.graphics.setVisible).toHaveBeenCalledWith(false);
    });

    it("placeAt flashes at the point via a fade tween", () => {
        const reticle = makeReticle();
        reticle.show();

        reticle.placeAt({ x: 80, y: 90 });

        expect(reticle.active).toBe(false);
        expect(reticle.graphics.setPosition).toHaveBeenCalledWith(80, 90);
        expect(reticle.scene.tweens.add).toHaveBeenCalledWith(
            expect.objectContaining({ alpha: 0 })
        );
    });

    it("cleanup removes its scene listeners", () => {
        const reticle = makeReticle();

        reticle.cleanup();

        expect(reticle.scene.events.off).toHaveBeenCalledWith(
            "pointermove:game",
            TargetReticle.prototype.onPointerMove,
            reticle
        );
        expect(reticle.scene.events.off).toHaveBeenCalledWith(
            Scenes.Events.SHUTDOWN,
            TargetReticle.prototype.cleanup,
            reticle
        );
    });
});
