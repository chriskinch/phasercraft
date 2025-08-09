import { GameObjects, Scene } from 'phaser';

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

	swoosh(): void {
		this.anims.play('attack', true);
	}

}

export default Weapon;