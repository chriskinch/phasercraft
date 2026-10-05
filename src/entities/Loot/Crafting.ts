import { GameObjects, Scene, Physics, Time } from "phaser";
import store from "@store";
import { playSfx } from "@services/sfx";
import { addComponent } from "@store/gameReducer";
import getRandomVelocity from "@helpers/getRandomVelocity";
import type { GameSceneLike } from "@/types/scene";
import type { ComponentType } from "@/types/game";

interface CraftingConfig {
    scene: Scene;
    x: number;
    y: number;
    key: string;
}

class Crafting extends GameObjects.Sprite {
    public name: string;
    public body!: Physics.Arcade.Body;
    public activateTimer?: Time.TimerEvent;
    public collider?: Physics.Arcade.Collider;

    constructor(config: CraftingConfig) {
        super(config.scene, config.x, config.y, "crafting", config.key);
        config.scene.physics.world.enable(this);
        config.scene.add.existing(this).setDepth((this.scene as GameSceneLike).depth_group.UI);

        this.name = config.key;

        // this.anims.play('coin');
        this.body.setVelocity(getRandomVelocity(25, 50), getRandomVelocity(25, 50)).setDrag(100);
        this.body.immovable = true;

        this.activateTimer = this.scene.time.delayedCall(500, this.activate, [], this);
        this.once("loot:collect", this.collect, this);

        // Lifecycle: the activate timer and the player collider outlive a plain
        // destroy (the component's own "loot:collect" listener goes with it), so
        // release both when it is destroyed (collected, or on shutdown). Released
        // on DESTROY, after the collect tween, like Gem/Special/Scroll: removing
        // the collider on collect would change player/loot separation mid-tween.
        this.once(GameObjects.Events.DESTROY, this.cleanup, this);
    }

    activate(): void {
        this.collider = this.scene.physics.add.collider(
            (this.scene as GameSceneLike).player,
            this,
            this.touch,
            undefined,
            this
        );
    }

    cleanup(): void {
        if (this.activateTimer) this.activateTimer.remove();
        if (this.collider) this.scene.physics.world.removeCollider(this.collider);
        this.activateTimer = undefined;
        this.collider = undefined;
    }

    touch(): void {
        this.emit("loot:collect", this);
    }

    collect(): void {
        store.dispatch(addComponent(this.name as ComponentType));
        playSfx("coin");

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

export default Crafting;
