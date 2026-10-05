import { GameObjects, Scenes } from "phaser";
import type { Scene } from "phaser";

interface CastBarStart {
    duration: number;
}

interface CastBarOptions {
    // Bar offset in the container; the default sits above the player's bars.
    y?: number;
    // Follow the player's "spell:castbar:start/stop" scene events. Owners that
    // drive the bar directly (enemy healers) pass false and call onStart/onStop.
    listen?: boolean;
}

// Wind-up/channel progress bar shown above the player's status bars, driven
// by the CastingController's "spell:castbar:start/stop" scene events (or
// directly via onStart/onStop, e.g. by an enemy healer). The
// fill sweeps left→right over the cast duration via a scene tween.
// Visuals match the Resource bars (see Resource.drawBar): a "resource-frame"
// sprite over a 0x111111 background bar and a coloured fill sized to the
// frame texture, at depths 998/999/1000.
class CastBar {
    private scene: Scene;
    private frame: GameObjects.Sprite;
    private background: GameObjects.Graphics;
    private fill: GameObjects.Graphics;
    private tween: Phaser.Tweens.Tween | null = null;

    constructor(
        scene: Scene,
        container: GameObjects.Container,
        { y = -47, listen = true }: CastBarOptions = {}
    ) {
        this.scene = scene;

        // Player default sits just above the shield bar (health -35, resource
        // -30, shield -40).
        this.frame = scene.add.sprite(-14, y, "resource-frame").setOrigin(0, 0).setDepth(1000);
        this.background = this.drawBar(0x111111, 998);
        this.fill = this.drawBar(0xffcc33, 999);
        container.add([this.background, this.fill, this.frame]);
        this.setVisible(false);

        if (listen) {
            scene.events.on("spell:castbar:start", this.onStart, this);
            scene.events.on("spell:castbar:stop", this.onStop, this);
        }
        scene.events.once(Scenes.Events.SHUTDOWN, this.cleanup, this);
    }

    private drawBar(colour: number, depth: number): GameObjects.Graphics {
        const graphics = this.scene.add.graphics();
        graphics.fillStyle(colour, 1);
        graphics.fillRect(0, 0, this.frame.width, this.frame.height);
        graphics.setDepth(depth);
        graphics.x = this.frame.x;
        graphics.y = this.frame.y;
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
        this.frame.setVisible(visible);
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
        // Idempotent; runs from Player.cleanup() / Healer.cleanup() and on scene
        // SHUTDOWN. off() of a listener never added is a no-op.
        this.scene.events.off("spell:castbar:start", this.onStart, this);
        this.scene.events.off("spell:castbar:stop", this.onStop, this);
        this.scene.events.off(Scenes.Events.SHUTDOWN, this.cleanup, this);
        this.removeTween();
    }
}

export default CastBar;
