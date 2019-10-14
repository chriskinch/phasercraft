class Hero extends Phaser.GameObjects.Sprite {

	constructor({scene, x=0, y=0, key}) {
		super(scene, x, y, key);
		scene.physics.world.enable(this);
		scene.add.existing(this);

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