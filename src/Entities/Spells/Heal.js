class Heal extends Phaser.GameObjects.Sprite {

	constructor(config) {
		super(config.scene, config.x, config.y, config.key);

		this.cooldown = 1000;
		this.value = 200;
		this.ready();

		this.scene.anims.create({
			key: 'heal-animation',
			frames: this.scene.anims.generateFrameNumbers('heal-effect', { start: 0, end: 24 }),
			frameRate: 24,
			repeat: 0,
			showOnStart: true,
			hideOnComplete: true
		});

		this.on('animationupdate', this.animationUpdate)
	}

	cast(target){
		this.target = target;
		this.target.health.adjustValue(this.value);
		this.animate();
		this.scene.time.delayedCall(this.cooldown, this.ready, [], this);
	}

	ready() {
		this.scene.events.once('heal', (target) => {
			this.cast(target);
		});
	}

	animate(){
		this.scene.add.existing(this).setDepth(1000);
		this.anims.play('heal-animation');
	}

	animationUpdate(){
		this.x = this.target.x;
		this.y = this.target.y;
	}
}

export default Heal;