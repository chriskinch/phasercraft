import { GameObjects, Physics, Scene, Time } from "phaser";
import type Enemy from "@entities/Enemy/Enemy";
import type Player from "@entities/Player/Player";
import type { ArcadeCollisionObject } from "@/types/game";
import type { GameSceneLike } from "@/types/scene";

// The objects this area effect overlaps with: the player and active enemies.
// Both carry a custom `uuid`; `name` is the Phaser GameObject name.
type OverlapTarget = Player | Enemy;

class AreaEffect extends GameObjects.Sprite {
    public body!: Physics.Arcade.Body;
    public timestamps?: Record<string, number>;
    public lifespanTimer?: Time.TimerEvent;
    public enemyCollider?: Physics.Arcade.Collider;
    public playerCollider?: Physics.Arcade.Collider;

    constructor(scene: Scene, x: number, y: number, lifespan: number, range: number) {
        super(scene, x, y - 7, "consecration");
        scene.physics.world.enable(this);
        scene.add.existing(this);

        this.enemyCollider = this.scene.physics.add.overlap(
            (this.scene as GameSceneLike).active_enemies,
            this,
            this.overlap,
            this.throttle,
            this
        );
        this.playerCollider = this.scene.physics.add.overlap(
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

        this.lifespanTimer = this.scene.time.delayedCall(
            lifespan * 1000,
            () => {
                delete this.timestamps;
                this.destroy();
            },
            [],
            this
        );

        // Lifecycle: the lifespan timer and both overlap colliders outlive a
        // plain destroy. Release them when the effect is destroyed so stale
        // colliders don't accumulate over repeated casts within a run.
        this.once(GameObjects.Events.DESTROY, this.cleanup, this);
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

    // Idempotent. Collider.destroy() nulls its world, so each collider is
    // released once and the reference cleared; removal from an already
    // shut-down world is a safe no-op.
    cleanup(): void {
        this.lifespanTimer?.remove();
        this.lifespanTimer = undefined;
        this.enemyCollider?.destroy();
        this.enemyCollider = undefined;
        this.playerCollider?.destroy();
        this.playerCollider = undefined;
    }
}

export default AreaEffect;
