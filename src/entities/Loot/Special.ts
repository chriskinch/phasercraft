import { GameObjects, Scene, Physics, Time } from "phaser";
import store from "@store";
import { playSfx } from "@services/sfx";
import { addSpecial } from "@store/gameReducer";
import getRandomVelocity from "@helpers/getRandomVelocity";
import sample from "lodash/sample";
import { SPECIAL_ITEMS } from "@/types/game";
import type { GameSceneLike } from "@/types/scene";

// Phaser texture key for a special item's sprite (loaded in LoadScene).
export const specialTextureKey = (id: string) => `special-${id}`;

interface SpecialConfig {
    scene: Scene;
    x: number;
    y: number;
    // Which special dropped; defaults to a random one from the catalog.
    id?: string;
}

// A special item (Blacksmith Step 4d) dropped in the world. Collected by
// walking over it, like a gem; picking it up adds one to the owned specials.
class Special extends GameObjects.Sprite {
    public body!: Physics.Arcade.Body;
    public activateTimer?: Time.TimerEvent;
    public collider?: Physics.Arcade.Collider;
    public specialId: string;

    constructor(config: SpecialConfig) {
        const id = config.id ?? sample(SPECIAL_ITEMS)!.id;
        super(config.scene, config.x, config.y, specialTextureKey(id));
        this.specialId = id;
        config.scene.physics.world.enable(this);
        config.scene.add.existing(this).setDepth((this.scene as GameSceneLike).depth_group.UI);

        // The loot sprites are 32px; half size matches the other world drops.
        this.setScale(0.5);
        this.body.setVelocity(getRandomVelocity(25, 50), getRandomVelocity(25, 50)).setDrag(100);
        this.body.immovable = true;

        this.activateTimer = this.scene.time.delayedCall(500, this.activate, [], this);
        this.once("loot:collect", this.collect, this);

        // Lifecycle: the activate timer and the player collider outlive a plain
        // destroy (the special's own "loot:collect" listener goes with it), so
        // release both when it is destroyed (collected, or on shutdown).
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
    }

    touch(): void {
        this.emit("loot:collect", this);
    }

    collect(): void {
        store.dispatch(addSpecial(this.specialId));
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

export default Special;
