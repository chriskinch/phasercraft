import { Scene } from "phaser";
import { FONT_FAMILY, FONT_URL } from "@config/fonts";

/**
 * First scene in the boot flow. Loads ONLY the minimal assets needed to render
 * the intro logo splash (the character sprite + the BoldPixels webfont), then
 * hands off to {@link LoadScene}, which shows that logo while the heavy asset
 * load runs. Keeping this tiny means the splash appears almost immediately.
 */
export default class BootScene extends Scene {
    constructor() {
        super({
            key: "BootScene",
        });
    }

    preload(): void {
        // Canvas Text only rasterises with a webfont that is already loaded, so
        // register BoldPixels through the loader (before setPath: FONT_URL is a
        // bundled asset URL, not relative to graphics/) so the splash logo and
        // every later Text draws in it rather than the fallback.
        this.load.font(FONT_FAMILY, FONT_URL, "woff2");
        this.load.setPath("graphics");
        this.load.spritesheet("warrior", "spritesheets/player/warrior.gif", {
            frameWidth: 24,
            frameHeight: 32,
        });
    }

    create(): void {
        this.scene.start("LoadScene");
    }
}
