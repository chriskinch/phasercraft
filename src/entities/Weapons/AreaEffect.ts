import { GameObjects, Physics, Scene } from "phaser";
import type GameScene from "@scenes/GameScene";

class AreaEffect extends GameObjects.Sprite {
    public body: Physics.Arcade.Body;
    public timestamps?: Record<string, number>;

    constructor(scene: Scene, x: number, y: number, lifespan: number, range: number) {
        super(scene, x, y - 7, "consecration");
        scene.physics.world.enable(this);
        scene.add.existing(this);

        this.scene.physics.add.overlap(
            (this.scene as GameScene).active_enemies,
            this,
            this.overlap,
            this.throttle,
            this
        );
        this.scene.physics.add.overlap(
            (this.scene as GameScene).player,
            this,
            this.overlap,
            this.throttle,
            this
        );

        this.body.isCircle = true;

        const offset = this.width / 2 - range;
        this.body.setCircle(range, offset, offset);

        this.setScale(1, 0.8);

        this.timestamps = {};

        this.scene.time.delayedCall(
            lifespan * 1000,
            () => {
                delete this.timestamps;
                this.destroy();
            },
            [],
            this
        );
    }

    overlap(target: any): void {
        const type = target.name === "player" ? "player" : "enemy";
        // Non-null assertion preserves the JS behavior: timestamps is only
        // deleted immediately before destroy(), after which overlap() (a
        // collider callback) is no longer invoked.
        this.timestamps![target.uuid] = this.scene.game.getTime();
        this.emit(`${type}:area:overlap`, target);
    }

    throttle(target: any): boolean {
        return this.timestamps![target.uuid]
            ? this.scene.game.getTime() - this.timestamps![target.uuid] > 1000
            : !this.timestamps![target.uuid];
    }
}

export default AreaEffect;
