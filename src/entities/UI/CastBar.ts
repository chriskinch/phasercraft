import { GameObjects, Scenes } from "phaser";
import type { Scene } from "phaser";

interface CastBarStart {
    duration: number;
}

// Wind-up/channel progress bar shown above the player's status bars, driven
// by the CastingController's "spell:castbar:start/stop" scene events. The
// fill sweeps left→right over the cast duration via a scene tween.
class CastBar {
    private scene: Scene;
    private background: GameObjects.Graphics;
    private fill: GameObjects.Graphics;
    private tween: Phaser.Tweens.Tween | null = null;

    constructor(scene: Scene, container: GameObjects.Container) {
        this.scene = scene;

        this.background = this.drawBar(0x111111, 28, 4);
        this.fill = this.drawBar(0xffcc33, 28, 4);
        container.add([this.background, this.fill]);
        this.setVisible(false);

        scene.events.on("spell:castbar:start", this.onStart, this);
        scene.events.on("spell:castbar:stop", this.onStop, this);
        scene.events.once(Scenes.Events.SHUTDOWN, this.cleanup, this);
    }

    private drawBar(colour: number, width: number, height: number): GameObjects.Graphics {
        const graphics = this.scene.add.graphics();
        graphics.fillStyle(colour, 1);
        graphics.fillRect(0, 0, width, height);
        graphics.setDepth(1000);
        // Sits just above the shield bar (health -35, resource -30, shield -40).
        graphics.x = -14;
        graphics.y = -47;
        return graphics;
    }

    onStart({ duration }: CastBarStart): void {
        this.removeTween();
        this.fill.scaleX = 0;
        this.setVisible(true);
        this.tween = this.scene.tweens.addCounter({
            from: 0,
            to: 1,
            duration: duration * 1000,
            onUpdate: (tween: Phaser.Tweens.Tween) => {
                this.fill.scaleX = tween.getValue() ?? 0;
            },
        });
    }

    onStop(): void {
        this.removeTween();
        this.setVisible(false);
    }

    private setVisible(visible: boolean): void {
        this.background.setVisible(visible);
        this.fill.setVisible(visible);
    }

    private removeTween(): void {
        if (this.tween) {
            this.tween.remove();
            this.tween = null;
        }
    }

    cleanup(): void {
        // Idempotent; runs from Player.cleanup() and on scene SHUTDOWN.
        this.scene.events.off("spell:castbar:start", this.onStart, this);
        this.scene.events.off("spell:castbar:stop", this.onStop, this);
        this.scene.events.off(Scenes.Events.SHUTDOWN, this.cleanup, this);
        this.removeTween();
    }
}

export default CastBar;
