import { getSpellSchools, getAssendedClass } from '../Config/ClassConfig'

class Enemy extends Phaser.GameObjects.Sprite {

	constructor(config) {
		super(config.scene, config.x, config.y, config.key);
		config.scene.physics.world.enable(this);
		config.scene.add.existing(this);

		this.name = config.name;
		this.type = config.type;

		this.hero = this.scene.hero;
	}

	update(time, delta) {
		this.scene.physics.moveTo(this, this.hero.x, this.hero.y, 50);
		let walk_animation = (this.x - this.hero.x > 0) ? "enemy-left-down" : "enemy-right-up";;
		this.anims.play(walk_animation, true);
	}
}

export default Enemy;