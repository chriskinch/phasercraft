import { describe, it, expect, vi } from "vitest";
import { Scenes } from "phaser";
import CastBar from "./CastBar";

// Prototype-fake tests (no Phaser boot) for the wind-up/channel progress bar.

interface GraphicsStub {
    setVisible: ReturnType<typeof vi.fn>;
    scaleX: number;
}

interface CastBarUnderTest {
    scene: {
        events: { off: ReturnType<typeof vi.fn> };
        tweens: { addCounter: ReturnType<typeof vi.fn> };
    };
    frame: { setVisible: ReturnType<typeof vi.fn> };
    background: GraphicsStub;
    fill: GraphicsStub;
    tween: { remove: ReturnType<typeof vi.fn> } | null;
    onStart(payload: { duration: number }): void;
    onStop(): void;
    cleanup(): void;
}

function makeCastBar(): CastBarUnderTest {
    const bar = Object.create(CastBar.prototype) as CastBarUnderTest;
    bar.scene = {
        events: { off: vi.fn() },
        tweens: { addCounter: vi.fn(() => ({ remove: vi.fn() })) },
    };
    bar.frame = { setVisible: vi.fn() };
    bar.background = { setVisible: vi.fn(), scaleX: 1 };
    bar.fill = { setVisible: vi.fn(), scaleX: 1 };
    bar.tween = null;
    return bar;
}

describe("CastBar", () => {
    it("shows and sweeps the fill over the cast duration", () => {
        const bar = makeCastBar();

        bar.onStart({ duration: 1.5 });

        expect(bar.fill.scaleX).toBe(0);
        expect(bar.frame.setVisible).toHaveBeenCalledWith(true);
        expect(bar.background.setVisible).toHaveBeenCalledWith(true);
        expect(bar.fill.setVisible).toHaveBeenCalledWith(true);
        expect(bar.scene.tweens.addCounter).toHaveBeenCalledWith(
            expect.objectContaining({ from: 0, to: 1, duration: 1500 })
        );
    });

    it("hides and kills the tween on stop", () => {
        const bar = makeCastBar();
        bar.onStart({ duration: 1 });
        const tween = bar.tween!;

        bar.onStop();

        expect(tween.remove).toHaveBeenCalled();
        expect(bar.tween).toBeNull();
        expect(bar.background.setVisible).toHaveBeenCalledWith(false);
        expect(bar.fill.setVisible).toHaveBeenCalledWith(false);
    });

    it("restarting replaces the running tween", () => {
        const bar = makeCastBar();
        bar.onStart({ duration: 1 });
        const first = bar.tween!;

        bar.onStart({ duration: 2 });

        expect(first.remove).toHaveBeenCalled();
        expect(bar.scene.tweens.addCounter).toHaveBeenCalledTimes(2);
    });

    it("cleanup removes its scene listeners and tween", () => {
        const bar = makeCastBar();
        bar.onStart({ duration: 1 });
        const tween = bar.tween!;

        bar.cleanup();

        expect(bar.scene.events.off).toHaveBeenCalledWith(
            "spell:castbar:start",
            CastBar.prototype.onStart,
            bar
        );
        expect(bar.scene.events.off).toHaveBeenCalledWith(
            "spell:castbar:stop",
            CastBar.prototype.onStop,
            bar
        );
        expect(bar.scene.events.off).toHaveBeenCalledWith(
            Scenes.Events.SHUTDOWN,
            CastBar.prototype.cleanup,
            bar
        );
        expect(tween.remove).toHaveBeenCalled();
    });
});
