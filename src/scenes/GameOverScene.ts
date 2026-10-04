import { Scene, Display } from "phaser";
import { pixelFontSize } from "@config/fonts";
import { addBanner } from "./pixelFonts";

export default class GameOverScene extends Scene {
    private global_game_width!: number;
    private global_game_height!: number;
    private zone!: Phaser.GameObjects.Zone;
    private game_over!: Phaser.GameObjects.Container;

    constructor() {
        super({
            key: "GameOverScene",
        });
    }

    create(): void {
        const scene_padding = 60;
        this.global_game_width = this.scale.width;
        this.global_game_height = this.scale.height;
        // Only centres the banner, so the safe-area insets don't matter here.
        this.zone = this.add
            .zone(
                scene_padding,
                scene_padding,
                this.global_game_width - scene_padding * 2,
                this.global_game_height - scene_padding * 2
            )
            .setOrigin(0);

        this.game_over = this.add.container(0, 0);
        Display.Align.In.Center(this.game_over, this.zone);

        this.game_over.add(addBanner(this, 0, 0, "GAME OVER", pixelFontSize(3)));
        this.game_over.add(addBanner(this, 0, 40, "RESTART", pixelFontSize(2)));
        (
            this.game_over as Phaser.GameObjects.Container & { button: Phaser.GameObjects.Image }
        ).button = this.add.image(0, 60, "blank-gif").setScale(12, 4).setInteractive();
        (
            this.game_over as Phaser.GameObjects.Container & { button: Phaser.GameObjects.Image }
        ).button.on("pointerup", this.restartGame, this);
        this.game_over.add(
            (this.game_over as Phaser.GameObjects.Container & { button: Phaser.GameObjects.Image })
                .button
        );
    }

    restartGame(): void {
        // Pass explicit (empty) data: Phaser keeps a scene's previous data when
        // started without any, which would carry a stale `arrival: "gate"` from
        // the last biome return. TownScene.init falls back to the store's class.
        this.scene.start("TownScene", {});
    }

    shutdown(): void {
        const buttonContainer = this.game_over as Phaser.GameObjects.Container & {
            button: Phaser.GameObjects.Image;
        };
        if (buttonContainer.button) {
            buttonContainer.button.off("pointerup");
        }
    }
}
