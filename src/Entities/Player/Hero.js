import { GameObjects } from 'phaser';

class Hero extends GameObjects.Sprite {

	constructor(config) {
		super(config.scene, 0, 0, config.key);
		config.scene.add.existing(this);
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

	root(){
		this.anims.play('player-idle', true);
		this.anims.stop();
	}
}

export default Hero;