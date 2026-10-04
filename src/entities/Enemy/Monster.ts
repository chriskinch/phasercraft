import { GameObjects, Scene } from "phaser";
import Player from "@entities/Player/Player";
import Enemy from "@entities/Enemy/Enemy";
import { animationKeys } from "./animationKeys";
interface MonsterConfig {
    scene: Scene;
    key: string;
    x: number;
    y: number;
    target: Player | Enemy | null;
}

// The enemy's visual only: its physics body lives on the Enemy container. The
// sprite gets none — a second, inert body per enemy cost an Arcade step and an
// RTree slot each (#529).
class Monster extends GameObjects.Sprite {
    public key: string;
    public frozen = false;

    constructor(config: MonsterConfig) {
        super(config.scene, 0, 0, config.key);
        config.scene.add.existing(this);

        this.key = config.key;
    }

    walk(anim: string): void {
        this.anims.play(anim, true);
    }

    idle(): void {
        this.anims.play(animationKeys(this.key).idle, true);
    }

    // Stun pose: first idle frame, paused, so the monster is fully static.
    freeze(): void {
        if (this.frozen) return;
        this.frozen = true;
        this.anims.play(animationKeys(this.key).idle);
        this.anims.pause(this.anims.currentAnim?.frames[0]);
    }

    unfreeze(): void {
        if (!this.frozen) return;
        this.frozen = false;
        this.anims.resume();
    }

    death(): void {
        this.unfreeze();
        this.anims.play(animationKeys(this.key).death);
    }
}

export default Monster;
