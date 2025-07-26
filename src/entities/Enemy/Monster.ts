import { GameObjects, Scene, Physics } from 'phaser';

interface MonsterConfig {
	scene: Scene;
	key: string;
	x: number;
	y: number;
	target: any;
}

class Monster extends GameObjects.Sprite {
	public key: string;
	public body: Physics.Arcade.Body;

	constructor(config: MonsterConfig) {
		super(config.scene, 0, 0, config.key);
		config.scene.physics.world.enable(this);
		config.scene.add.existing(this);

    	this.key = config.key;
	}

	walk(anim: string): void {
		this.anims.play(anim, true);
	}
	
	idle(): void {
		this.anims.play(this.key + '-idle', true);
	}

	death(): void {
		this.anims.play(this.key + '-death');
	}
}

export default Monster;