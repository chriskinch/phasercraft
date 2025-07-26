import { GameObjects, Scene, Physics } from 'phaser';

interface HeroConfig {
	scene: Scene;
	key: string;
}

class Hero extends GameObjects.Sprite {
	public body: Physics.Arcade.Body;

	constructor(config: HeroConfig) {
		super(config.scene, 0, 0, config.key);
		config.scene.physics.world.enable(this);
		config.scene.add.existing(this);
		this.body.collideWorldBounds = true;
		this.body.immovable = true;
	}

	walk(anim: string): void {
		this.anims.play(anim, true);
	}

	death(): void {
		this.anims.play('player-death');
	}

	idle(): void {
		this.anims.play('player-idle', true);
	}

	root(): void {
		this.anims.play('player-idle', true);
		this.anims.stop();
	}
}

export default Hero;