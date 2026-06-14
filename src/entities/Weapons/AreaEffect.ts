import { GameObjects, Physics, Scene } from "phaser";
import type Enemy from "@entities/Enemy/Enemy";
import type Player from "@entities/Player/Player";
import type { ArcadeCollisionObject } from "@/types/game";
import type { GameSceneLike } from "@/types/scene";

// The objects this area effect overlaps with: the player and active enemies.
// Both carry a custom `uuid`; `name` is the Phaser GameObject name.
type OverlapTarget = Player | Enemy;

class AreaEffect extends GameObjects.Sprite {
    public body: Physics.Arcade.Body;
    public timestamps?: Record<string, number>;

    constructor(scene: Scene, x: number, y: number, lifespan: number, range: number) {
        super(scene, x, y - 7, "consecration");
        scene.physics.world.enable(this);
        scene.add.existing(this);

        this.scene.physics.add.overlap(
            (this.scene as GameSceneLike).active_enemies,
            this,
            this.overlap,
            this.throttle,
            this
        );
        this.scene.physics.add.overlap(
            (this.scene as GameSceneLike).player,
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

    // Arcade overlap callback. The bodies registered above are the player and
    // active enemies, so the colliding object is a Player or Enemy.
    overlap(object: ArcadeCollisionObject): void {
        const target = object as OverlapTarget;
        const type = target.name === "player" ? "player" : "enemy";
        // Non-null assertion preserves the JS behavior: timestamps is only
        // deleted immediately before destroy(), after which overlap() (a
        // collider callback) is no longer invoked.
        this.timestamps![target.uuid] = this.scene.game.getTime();
        this.emit(`${type}:area:overlap`, target);
    }

    // Arcade overlap process-callback. Same Player|Enemy target as overlap().
    throttle(object: ArcadeCollisionObject): boolean {
        const target = object as OverlapTarget;
        return this.timestamps![target.uuid]
            ? this.scene.game.getTime() - this.timestamps![target.uuid] > 1000
            : !this.timestamps![target.uuid];
    }
}

export default AreaEffect;
