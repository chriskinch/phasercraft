class Weapon extends Phaser.GameObjects.Sprite {

	constructor(config, options={}) {
		super(config.scene, 0, 0, config.key);
		config.scene.add.existing(this);

		this.visible = false;
		this.setDepth(200);
	}

	swoosh(){
		this.anims.play('attack', true);
	}

}

export default Weapon;