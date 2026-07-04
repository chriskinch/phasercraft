import { Scene } from "phaser";

/**
 * First scene in the boot flow. Loads ONLY the minimal assets needed to render
 * the intro logo splash (the character sprite + the wayne-3d font image), then
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
        this.load.setPath("graphics");
        this.load.image("wayne-3d", "fonts/wayne-3d.png");
        this.load.spritesheet("warrior", "spritesheets/player/warrior.gif", {
            frameWidth: 24,
            frameHeight: 32,
        });
    }

    create(): void {
        this.scene.start("LoadScene");
    }
}
