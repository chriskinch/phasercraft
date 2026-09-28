import { describe, it, expect, vi, afterEach } from "vitest";
import { enterFullscreenOnFirstTap } from "./fullscreenCutout";

function stubDisplayMode(installed: boolean) {
    vi.stubGlobal(
        "matchMedia",
        vi.fn(() => ({ matches: installed }))
    );
}

function makeDoc() {
    const requestFullscreen = vi.fn(() => Promise.resolve());
    const listeners: Array<() => void> = [];
    const doc = {
        documentElement: { requestFullscreen },
        fullscreenElement: null as Element | null,
        addEventListener: vi.fn((_: string, fn: () => void) => listeners.push(fn)),
    };
    const tap = () => listeners.forEach((fn) => fn());
    return { doc, requestFullscreen, tap };
}

describe("enterFullscreenOnFirstTap", () => {
    afterEach(() => vi.unstubAllGlobals());

    it("requests fullscreen on the first tap in the installed app", () => {
        stubDisplayMode(true);
        const { doc, requestFullscreen, tap } = makeDoc();

        enterFullscreenOnFirstTap(doc as unknown as Document);
        expect(doc.addEventListener).toHaveBeenCalledWith("pointerdown", expect.any(Function), {
            once: true,
            capture: true,
        });
        tap();

        expect(requestFullscreen).toHaveBeenCalledWith({ navigationUI: "hide" });
    });

    it("does nothing in a plain browser tab", () => {
        stubDisplayMode(false);
        const { doc } = makeDoc();

        enterFullscreenOnFirstTap(doc as unknown as Document);

        expect(doc.addEventListener).not.toHaveBeenCalled();
    });

    it("skips the request when already fullscreen", () => {
        stubDisplayMode(true);
        const { doc, requestFullscreen, tap } = makeDoc();
        doc.fullscreenElement = {} as Element;

        enterFullscreenOnFirstTap(doc as unknown as Document);
        tap();

        expect(requestFullscreen).not.toHaveBeenCalled();
    });
});
