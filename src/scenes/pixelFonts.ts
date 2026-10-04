import { GameObjects, type Scene } from "phaser";
import { BANNER_SHADOW, bannerDepth, FONT_ATLAS, FONT_VARIANTS, FONTS } from "@config/fonts";

// The bitmap fonts behind every in-game text (#534): one atlas, a frame per
// colour variant, and two BMFont layouts shared by those frames (see
// scripts/build-pixel-font.ts). Loaded by BootScene so the splash logo has them.

const xmlKey = (layout: "plain" | "outlined") => `${FONT_ATLAS}-${layout}`;

/** Queues the atlas and layouts. Call before `load.setPath`, or with it unset. */
export function loadPixelFonts(scene: Scene): void {
    scene.load.atlas(
        FONT_ATLAS,
        `graphics/fonts/${FONT_ATLAS}.png`,
        `graphics/fonts/${FONT_ATLAS}.json`
    );
    scene.load.xml(xmlKey("plain"), `graphics/fonts/${xmlKey("plain")}.xml`);
    scene.load.xml(xmlKey("outlined"), `graphics/fonts/${xmlKey("outlined")}.xml`);
}

/** Registers every variant as a bitmap font, once the loads have finished. */
export function registerPixelFonts(scene: Scene): void {
    FONT_VARIANTS.forEach(({ key, outline }) => {
        if (scene.cache.bitmapFont.exists(key)) return;
        const layout = outline === undefined ? "plain" : "outlined";
        if (!GameObjects.BitmapText.ParseFromAtlas(scene, key, FONT_ATLAS, key, xmlKey(layout))) {
            throw new Error(`bitmap font ${key} failed to register`);
        }
    });
}

/**
 * A centred magenta banner (AREA CLEARED, GAME OVER). The drop shadow redraws
 * the outlined glyphs in the shadow colour, offset: the old 3D extrusion.
 */
export function addBanner(
    scene: Scene,
    x: number,
    y: number,
    text: string,
    fontSize: number
): GameObjects.BitmapText {
    const depth = bannerDepth(fontSize);
    return scene.add
        .bitmapText(x, y, FONTS.banner, text, fontSize)
        .setOrigin(0.5)
        .setDropShadow(depth, depth, BANNER_SHADOW, 1);
}
