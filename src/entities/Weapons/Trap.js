import { GameObjects } from "phaser";
import { dropIn } from "@helpers/spawnStyle";

class Trap extends GameObjects.Sprite {
    constructor(scene, x, y, lifespan) {
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

    collide(target) {
        if (target.spawned) {
            this.emit("trap:collide", target);
            this.destroy();
        }
    }

    spawnedHandler() {
        this.enemyCollider = this.scene.physics.add.collider(
            this.scene.active_enemies,
            this,
            this.collide,
            null,
            this
        );
        this.playerCollider = this.scene.physics.add.collider(
            this.scene.player,
            this,
            this.destroy,
            null,
            this
        );
    }

    cleanup() {
        if (this.lifespanTimer) this.lifespanTimer.remove();
        if (this.enemyCollider) this.scene.physics.world.removeCollider(this.enemyCollider);
        if (this.playerCollider) this.scene.physics.world.removeCollider(this.playerCollider);
    }
}

export default Trap;
