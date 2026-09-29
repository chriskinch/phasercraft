import { GameObjects, Physics, Scene, Time, Types } from "phaser";
import { dropIn } from "@helpers/spawnStyle";
import type { ArcadeCollisionObject } from "@/types/game";
import type { GameSceneLike } from "@/types/scene";
import type Enemy from "@entities/Enemy/Enemy";

class Trap extends GameObjects.Sprite {
    public body!: Physics.Arcade.Body;
    public spawned?: boolean;
    public lifespanTimer?: Time.TimerEvent;
    public enemyCollider?: Physics.Arcade.Collider;
    public playerCollider?: Physics.Arcade.Collider;

    constructor(scene: Scene, x: number, y: number, lifespan: number) {
        super(scene, x, y - 20, "snare-trap");
        scene.physics.world.enable(this);
        scene.add.existing(this);

        // A real circle (radius 12, centred on the 24x21 frame). A bare
        // `isCircle = true` kept the 24x21 box but collided as a radius-12
        // circle that reaches below it, so the drop-in stop caught the trap in
        // that gap and pushed it back up on every contact. At 60Hz+ it never
        // rested two steps running, so it bounced until expiry and never armed.
        this.body.setCircle(this.width / 2, 0, (this.height - this.width) / 2);

        dropIn("trap", this, y + 20, { gravity: 500, bounce: 0.4 });

        this.on("trap:spawned", this.spawnedHandler, this);

        this.lifespanTimer = this.scene.time.delayedCall(
            lifespan * 1000,
            () => {
                this.destroy();
            },
            [],
            this
        );

        // Lifecycle: the lifespan timer and the two colliders outlive a plain
        // destroy (the trap's own "trap:spawned" listener is removed by Phaser).
        // Release them when the trap is destroyed (on collide, expiry, or
        // shutdown) so stale colliders don't accumulate during a run.
        this.once(GameObjects.Events.DESTROY, this.cleanup, this);
    }

    // Arcade collide callback against `active_enemies`, so the object is an
    // Enemy. Only a spawned enemy springs the trap. This used to read an
    // Enemy `spawned` flag that became `state` long ago, so it never fired.
    collide(target: ArcadeCollisionObject): void {
        if ((target as Enemy).state === "spawned") {
            this.emit("trap:collide", target);
            this.destroy();
        }
    }

    spawnedHandler(): void {
        this.enemyCollider = this.scene.physics.add.collider(
            (this.scene as GameSceneLike).active_enemies,
            this,
            this.collide,
            undefined,
            this
        );
        // `this.destroy` is passed as the collide callback as in the original JS.
        // Its signature `(fromScene?: boolean)` does not match ArcadePhysicsCallback
        // (Phaser invokes it with the two colliding objects), so cast to preserve
        // the existing runtime behavior without altering the call.
        this.playerCollider = this.scene.physics.add.collider(
            (this.scene as GameSceneLike).player,
            this,
            this.destroy as unknown as Types.Physics.Arcade.ArcadePhysicsCallback,
            undefined,
            this
        );
    }

    cleanup(): void {
        if (this.lifespanTimer) this.lifespanTimer.remove();
        if (this.enemyCollider) this.scene.physics.world.removeCollider(this.enemyCollider);
        if (this.playerCollider) this.scene.physics.world.removeCollider(this.playerCollider);
    }
}

export default Trap;
