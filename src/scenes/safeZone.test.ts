import { describe, it, expect, vi, beforeEach } from "vitest";
import { Scale, type Scene } from "phaser";
import { addSafeZone } from "./safeZone";

// addSafeZone registers two external listeners (the game-level ScaleManager's
// RESIZE and the page-level inset watcher); release() must drop both. The
// watcher is stubbed so the inset values and change notifications are driven
// from the test.
const watcher = vi.hoisted(() => ({
    insets: { top: 0, right: 0, bottom: 0, left: 0 },
    listeners: new Set<() => void>(),
    unwatch: vi.fn(),
}));

vi.mock("@helpers/safeArea", async (importOriginal) => {
    const actual = await importOriginal<typeof import("@helpers/safeArea")>();
    return {
        ...actual,
        getHudInsets: () => watcher.insets,
        watchHudInsets: (listener: () => void) => {
            watcher.listeners.add(listener);
            return () => {
                watcher.unwatch();
                watcher.listeners.delete(listener);
            };
        },
    };
});

function makeScene() {
    const zone = { setOrigin: vi.fn(), setPosition: vi.fn(), setSize: vi.fn() };
    for (const fn of Object.values(zone)) fn.mockReturnValue(zone);
    const scale = { width: 844, height: 390, on: vi.fn(), off: vi.fn() };
    const scene = { add: { zone: vi.fn(() => zone) }, scale } as unknown as Scene;
    return { scene, zone, scale };
}

describe("addSafeZone", () => {
    beforeEach(() => {
        watcher.insets = { top: 0, right: 0, bottom: 0, left: 0 };
        watcher.listeners.clear();
        watcher.unwatch.mockClear();
    });

    it("fits the zone inside the insets and padding on creation, without a layout callback", () => {
        watcher.insets = { top: 0, right: 47, bottom: 21, left: 47 };
        const { scene, zone } = makeScene();
        const onLayout = vi.fn();

        addSafeZone(scene, 40, onLayout);

        expect(zone.setPosition).toHaveBeenCalledWith(87, 40);
        expect(zone.setSize).toHaveBeenCalledWith(670, 289);
        expect(onLayout).not.toHaveBeenCalled();
    });

    it("re-fits the zone and re-lays out on canvas resize", () => {
        const { scene, zone, scale } = makeScene();
        const onLayout = vi.fn();
        addSafeZone(scene, 40, onLayout);
        const [event, handler] = scale.on.mock.calls[0];
        expect(event).toBe(Scale.Events.RESIZE);

        scale.width = 700;
        handler();

        expect(zone.setSize).toHaveBeenLastCalledWith(620, 310);
        expect(onLayout).toHaveBeenCalledTimes(1);
    });

    it("re-fits the zone and re-lays out when the insets change", () => {
        const { scene, zone } = makeScene();
        const onLayout = vi.fn();
        addSafeZone(scene, 40, onLayout);

        watcher.insets = { top: 0, right: 47, bottom: 0, left: 47 };
        watcher.listeners.forEach((listener) => listener());

        expect(zone.setPosition).toHaveBeenLastCalledWith(87, 40);
        expect(onLayout).toHaveBeenCalledTimes(1);
    });

    it("release() removes the resize handler and stops watching, idempotently", () => {
        const { scene, scale } = makeScene();
        const { release } = addSafeZone(scene, 40, vi.fn());
        const [, handler] = scale.on.mock.calls[0];

        release();
        release();

        expect(scale.off).toHaveBeenCalledWith(Scale.Events.RESIZE, handler);
        expect(watcher.listeners.size).toBe(0);
    });
});
