import { describe, it, expect, vi, afterEach } from "vitest";
import { GameObjects, type Scene } from "phaser";
import { BANNER_SHADOW, bannerDepth, FONT_VARIANTS, FONTS } from "@config/fonts";
import { addBanner, loadPixelFonts, registerPixelFonts } from "./pixelFonts";

// Fake scene at the loader / cache / factory seam.
function makeScene() {
    const fonts = new Set<string>();
    const banner = {
        setOrigin: vi.fn(() => banner),
        setDropShadow: vi.fn(() => banner),
    };
    const scene = {
        load: { atlas: vi.fn(), xml: vi.fn() },
        cache: { bitmapFont: { exists: (key: string) => fonts.has(key) } },
        add: { bitmapText: vi.fn(() => banner) },
    };
    return { scene, fonts, banner, asScene: scene as unknown as Scene };
}

afterEach(() => {
    vi.restoreAllMocks();
});

describe("loadPixelFonts", () => {
    it("queues the atlas and both layouts under graphics/fonts/", () => {
        const { scene, asScene } = makeScene();
        loadPixelFonts(asScene);
        expect(scene.load.atlas).toHaveBeenCalledWith(
            "bitbybit",
            "graphics/fonts/bitbybit.png",
            "graphics/fonts/bitbybit.json"
        );
        expect(scene.load.xml).toHaveBeenCalledWith(
            "bitbybit-plain",
            "graphics/fonts/bitbybit-plain.xml"
        );
        expect(scene.load.xml).toHaveBeenCalledWith(
            "bitbybit-outlined",
            "graphics/fonts/bitbybit-outlined.xml"
        );
    });
});

describe("registerPixelFonts", () => {
    it("registers each variant from its own atlas frame with its layout", () => {
        const { asScene, fonts } = makeScene();
        const parse = vi
            .spyOn(GameObjects.BitmapText, "ParseFromAtlas")
            .mockImplementation((_scene, key) => (fonts.add(key), true));

        registerPixelFonts(asScene);

        expect(parse).toHaveBeenCalledTimes(FONT_VARIANTS.length);
        expect(parse).toHaveBeenCalledWith(
            asScene,
            FONTS.plain,
            "bitbybit",
            FONTS.plain,
            "bitbybit-plain"
        );
        expect(parse).toHaveBeenCalledWith(
            asScene,
            FONTS.outline,
            "bitbybit",
            FONTS.outline,
            "bitbybit-outlined"
        );
        expect(parse).toHaveBeenCalledWith(
            asScene,
            "bitbybit-crit-magic",
            "bitbybit",
            "bitbybit-crit-magic",
            "bitbybit-outlined"
        );
    });

    it("skips fonts already in the cache, so a second call is a no-op", () => {
        const { asScene, fonts } = makeScene();
        const parse = vi
            .spyOn(GameObjects.BitmapText, "ParseFromAtlas")
            .mockImplementation((_scene, key) => (fonts.add(key), true));

        registerPixelFonts(asScene);
        parse.mockClear();
        registerPixelFonts(asScene);

        expect(parse).not.toHaveBeenCalled();
    });

    it("throws when a font fails to parse", () => {
        const { asScene } = makeScene();
        vi.spyOn(GameObjects.BitmapText, "ParseFromAtlas").mockReturnValue(false);
        expect(() => registerPixelFonts(asScene)).toThrow(
            `bitmap font ${FONTS.plain} failed to register`
        );
    });
});

describe("addBanner", () => {
    it("draws centred banner text with a one-font-pixel shadow", () => {
        const { scene, banner, asScene } = makeScene();
        expect(addBanner(asScene, 1, 2, "GAME OVER", 24)).toBe(banner);
        expect(scene.add.bitmapText).toHaveBeenCalledWith(1, 2, FONTS.banner, "GAME OVER", 24);
        expect(banner.setOrigin).toHaveBeenCalledWith(0.5);
        expect(banner.setDropShadow).toHaveBeenCalledWith(
            bannerDepth(24),
            bannerDepth(24),
            BANNER_SHADOW,
            1
        );
    });
});
