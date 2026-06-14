import { GameObjects, Display } from "phaser";
import store from "@store";
import { addCoins } from "@store/gameReducer";
import getRandomVelocity from "@helpers/getRandomVelocity";
import random from "lodash/random";

class Gem extends GameObjects.Sprite {
    constructor(config) {
        super(config.scene, config.x, config.y, "gem-shine");
        config.scene.physics.world.enable(this);
        config.scene.add.existing(this).setDepth(this.scene.depth_group.UI);

        // this.anims.delayedPlay(random(1000,2000), 'gem');
        this.anims.playAfterDelay("gem", random(1000, 2000));
        this.body.setVelocity(getRandomVelocity(35, 70), getRandomVelocity(35, 70)).setDrag(100);
        this.body.immovable = true;

        this.activateTimer = this.scene.time.delayedCall(500, this.activate, [], this);
        this.once("loot:collect", this.collect, this);

        const color = new Display.Color().random(100);
        this.setScale(0.5).setTint(color.color);

        // Lifecycle: the activate timer and the player collider outlive a plain
        // destroy (the gem's own "loot:collect" listener is removed by Phaser).
        // Stale colliders are harmless no-ops but accumulate during a run, so
        // release both when the gem is destroyed (collected, or on shutdown).
        this.once(GameObjects.Events.DESTROY, this.cleanup, this);
    }

    activate() {
        this.collider = this.scene.physics.add.collider(
            this.scene.player,
            this,
            this.touch,
            null,
            this
        );
    }

    cleanup() {
        if (this.activateTimer) this.activateTimer.remove();
        if (this.collider) this.scene.physics.world.removeCollider(this.collider);
    }

    touch() {
        this.emit("loot:collect", this);
    }

    collect() {
        store.dispatch(addCoins(5));
        this.scene.tweens.add({
            targets: this,
            y: {
                value: this.y - 25,
                duration: 750,
                ease: "Cubic.easeOut",
            },
            alpha: {
                value: 0,
                duration: 750,
                ease: "Cubic.easeOut",
            },
            onComplete: () => this.destroy(),
        });
    }
}

export default Gem;
