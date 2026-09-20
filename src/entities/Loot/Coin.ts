import { GameObjects, Scene, Physics } from "phaser";
import store from "@store";
import { addCoins } from "@store/gameReducer";
import getRandomVelocity from "@helpers/getRandomVelocity";
import coinValue from "@helpers/coinValue";
import type { GameSceneLike } from "@/types/scene";

// What one coin is worth before the dropper's `coin_multiplier` is applied.
export const COIN_BASE_VALUE = 1;

interface CoinConfig {
    scene: Scene;
    x: number;
    y: number;
    // Payout multiplier inherited from the enemy that dropped this coin.
    coin_multiplier?: number;
}

class Coin extends GameObjects.Sprite {
    public body!: Physics.Arcade.Body;
    public value: number;

    constructor(config: CoinConfig) {
        super(config.scene, config.x, config.y, "coin-spin");
        this.value = coinValue(COIN_BASE_VALUE, config.coin_multiplier);
        config.scene.physics.world.enable(this);
        config.scene.add.existing(this).setDepth((this.scene as GameSceneLike).depth_group.UI);

        this.anims.play("coin");
        this.body.setVelocity(getRandomVelocity(25, 50), getRandomVelocity(25, 50)).setDrag(100);
        this.body.immovable = true;

        this.scene.time.delayedCall(500, this.activate, [], this);
        this.once("loot:collect", this.collect, this);
    }

    activate(): void {
        this.scene.physics.add.collider(
            (this.scene as GameSceneLike).player,
            this,
            this.touch,
            undefined,
            this
        );
    }

    touch(): void {
        this.emit("loot:collect", this);
    }

    collect(): void {
        store.dispatch(addCoins(this.value));
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

export default Coin;
