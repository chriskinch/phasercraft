class Heal extends Phaser.GameObjects.Sprite{

	constructor(config) {
		super(config.scene, config.x, config.y, config.key);
		//config.scene.add.existing(this);
	}

	cast(target){
		target.adjustHealth(100);
	}
}

export default Heal;