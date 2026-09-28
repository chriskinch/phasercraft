import { Scene, Display } from "phaser";
import { bannerStyle } from "@config/fonts";
import { readSafeAreaInsets, safeZoneRect } from "@helpers/safeArea";

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
        // Layout zone for the HUD: kept clear of the notch/home indicator.
        const safe = safeZoneRect(
            this.global_game_width,
            this.global_game_height,
            scene_padding,
            readSafeAreaInsets()
        );
        this.zone = this.add.zone(safe.x, safe.y, safe.width, safe.height).setOrigin(0);

        this.game_over = this.add.container(0, 0);
        Display.Align.In.Center(this.game_over, this.zone);

        this.game_over.add(this.add.text(0, 0, "GAME OVER", bannerStyle(32)).setOrigin(0.5));
        this.game_over.add(this.add.text(0, 40, "RESTART", bannerStyle(16)).setOrigin(0.5));
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
        this.scene.start("TownScene");
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
