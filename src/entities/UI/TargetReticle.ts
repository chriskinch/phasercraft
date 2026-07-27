import { GameObjects, Scenes } from "phaser";
import type { Scene } from "phaser";

// World-space placement indicator for ground-targeted spells: a radius ring
// that follows the pointer while the spell is primed and briefly flashes at
// the placement point when the cast commits. Driven directly by the
// CastingController.
class TargetReticle {
    private scene: Scene;
    private graphics: GameObjects.Graphics;
    private active = false;

    constructor(scene: Scene) {
        this.scene = scene;
        this.graphics = scene.add.graphics().setVisible(false);
        // Perspective squash, matching the enemy selection ring.
        this.graphics.scaleY = 0.5;
        this.graphics.setDepth(9998);
        scene.events.on("pointermove:game", this.onPointerMove, this);
        scene.events.once(Scenes.Events.SHUTDOWN, this.cleanup, this);
    }

    show(radius: number = 30): void {
        this.active = true;
        this.draw(radius);
        const pointer = this.scene.input.activePointer;
        const point = this.scene.cameras.main.getWorldPoint(pointer.x, pointer.y);
        this.graphics.setPosition(point.x, point.y);
        this.graphics.setAlpha(1);
        this.graphics.setVisible(true);
    }

    hide(): void {
        this.active = false;
        this.graphics.setVisible(false);
    }

    // Flash the ring at the committed placement point, then fade out.
    placeAt(point: { x: number; y: number }): void {
        this.active = false;
        this.graphics.setPosition(point.x, point.y);
        this.graphics.setAlpha(1);
        this.graphics.setVisible(true);
        this.scene.tweens.add({
            targets: this.graphics,
            alpha: 0,
            duration: 400,
            onComplete: () => {
                this.graphics.setVisible(false);
                this.graphics.setAlpha(1);
            },
        });
    }

    onPointerMove(scene: Scene, pointer: { x: number; y: number }): void {
        if (!this.active) return;
        const point = this.scene.cameras.main.getWorldPoint(pointer.x, pointer.y);
        this.graphics.setPosition(point.x, point.y);
    }

    private draw(radius: number): void {
        this.graphics.clear();
        this.graphics.lineStyle(3, 0xffff66, 0.9);
        this.graphics.strokeCircle(0, 0, radius);
    }

    cleanup(): void {
        // Idempotent; also runs on scene SHUTDOWN (the graphics object itself
        // is torn down with the scene's display list).
        this.scene.events.off("pointermove:game", this.onPointerMove, this);
        this.scene.events.off(Scenes.Events.SHUTDOWN, this.cleanup, this);
    }
}

export default TargetReticle;
