import { GameObjects, Physics, Scene, Time, Types } from "phaser";
import { dropIn } from "@helpers/spawnStyle";
import type GameScene from "@scenes/GameScene";

class Trap extends GameObjects.Sprite {
    public body: Physics.Arcade.Body;
    public spawned?: boolean;
    public lifespanTimer?: Time.TimerEvent;
    public enemyCollider?: Physics.Arcade.Collider;
    public playerCollider?: Physics.Arcade.Collider;

    constructor(scene: Scene, x: number, y: number, lifespan: number) {
        super(scene, x, y - 20, "snare-trap");
        scene.physics.world.enable(this);
        scene.add.existing(this);

        this.body.isCircle = true;

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

    collide(target: any): void {
        if (target.spawned) {
            this.emit("trap:collide", target);
            this.destroy();
        }
    }

    spawnedHandler(): void {
        this.enemyCollider = this.scene.physics.add.collider(
            (this.scene as GameScene).active_enemies,
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
            (this.scene as GameScene).player,
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
