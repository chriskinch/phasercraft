import { Scene } from "phaser";
import { loadPixelFonts, registerPixelFonts } from "./pixelFonts";

/**
 * First scene in the boot flow. Loads ONLY the minimal assets needed to render
 * the intro logo splash (the character sprite + the bitmap fonts), then
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
        loadPixelFonts(this);
        this.load.setPath("graphics");
        this.load.spritesheet("warrior", "spritesheets/player/warrior.gif", {
            frameWidth: 24,
            frameHeight: 32,
        });
    }

    create(): void {
        registerPixelFonts(this);
        this.scene.start("LoadScene");
    }
}
