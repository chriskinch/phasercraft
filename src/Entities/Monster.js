class Monster extends Phaser.GameObjects.Sprite {

	constructor(config) {
		super(config.scene, 0, 0, config.key);
		config.scene.physics.world.enable(this);
		config.scene.add.existing(this);
	}

	walk(anim){
		this.anims.play(anim, true);
	}
}

export default Monster;