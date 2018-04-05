class Enemy extends Phaser.GameObjects.Sprite {

	constructor(config) {
		super(config.scene, config.x, config.y, config.key);
		config.scene.physics.world.enable(this);
		config.scene.add.existing(this);
		this.body.setFriction(0,0);

		this.name = config.name;
		this.type = config.type;
		this.damage = config.damage;
		this.speed = config.speed || 50;
		//console.log(config.scene)
		this.hero = config.scene.player.hero;
	}

	update(time, delta) {
		if(this.hero.alive) {
			this.scene.physics.moveTo(this, this.hero.x, this.hero.y, this.speed);
			let walk_animation = (this.x - this.hero.x > 0) ? "enemy-left-down" : "enemy-right-up";;
			this.anims.play(walk_animation, true);
		}else{
			this.anims.stop();
		}
	}
}

export default Enemy;