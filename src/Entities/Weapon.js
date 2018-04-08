class Weapon extends Phaser.GameObjects.Sprite {

	constructor(config, options={}) {
		super(config.scene, config.x, config.y, config.key, config.frame);
		config.scene.physics.world.enable(this);
		config.scene.add.existing(this);

		this.offsetX = this.x;
		this.offsetY = this.y;
	}

	update(group){
		if(group) {
			this.x = group.x + this.offsetX;
			this.y = group.y + this.offsetY;
		}
	}
}

export default Weapon;