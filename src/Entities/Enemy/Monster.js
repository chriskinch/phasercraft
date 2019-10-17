import { GameObjects } from 'phaser';

class Monster extends GameObjects.Sprite {

	constructor(config) {
		super(config.scene, 0, 0, config.key);
		config.scene.physics.world.enable(this);
		config.scene.add.existing(this);

    this.key = config.key;
	}

	walk(anim){
		this.anims.play(anim, true);
	}

  death(){
    this.anims.play(this.key + '-death');
  }
}

export default Monster;