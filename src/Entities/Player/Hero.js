import { GameObjects } from 'phaser';

class Hero extends GameObjects.Sprite {

	constructor(config) {
		super(config.scene, 0, 0, config.key);
		config.scene.physics.world.enable(this);
		config.scene.add.existing(this);

		this.body.collideWorldBounds = true;
		this.body.immovable = true;
	}

	walk(anim){
		this.anims.play(anim, true);
	}

	death(){
		this.anims.play('player-death');
	}

	idle(){
		this.anims.play('player-idle', true);
	}
}

export default Hero;