import { GameObjects, Scene } from "phaser";
import { playSfx } from "@services/sfx";

interface WeaponConfig {
    scene: Scene;
    key: string;
}

class Weapon extends GameObjects.Sprite {
    constructor(config: WeaponConfig) {
        super(config.scene, 0, 0, config.key);
        config.scene.add.existing(this);

        this.visible = false;
        this.setDepth(200);
    }

    // Every melee swing, player's and enemy's, goes through here.
    swoosh(): void {
        this.anims.play("attack", true);
        playSfx("hurt");
    }
}

export default Weapon;
