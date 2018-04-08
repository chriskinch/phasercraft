class Weapon extends Phaser.GameObjects.Sprite {

	constructor(config, options={}) {
		super(config.scene, config.x, config.y, config.key);
		config.scene.add.existing(this);

		this.offsetX = this.x;
		this.offsetY = this.y;
		this.visible = false;
		this.setDepth(200);
	}

	swoosh(){
		this.anims.play('attack', true);
	}

}

export default Weapon;