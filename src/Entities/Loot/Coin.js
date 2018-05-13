class Coin extends Phaser.GameObjects.Sprite {

	constructor(config) {
		super(config.scene, config.x, config.y, 'coin-spin');
		config.scene.physics.world.enable(this);
		config.scene.add.existing(this).setDepth(this.scene.depth_group.UI);

		this.anims.play('coin');
		this.body.setVelocity(this.getRandomVelocity(), this.getRandomVelocity()).setDrag(100);
		this.body.immovable = true;

		this.scene.time.delayedCall(500, this.activate, [], this);
		this.once('loot:collect', this.collect, this);
	}

	activate(){
		this.scene.physics.add.collider(this.scene.player, this, this.touch, null, this);
	}

	touch(){
		this.emit('loot:collect', this);
	}

	collect(){
		this.scene.coins++;
		this.scene.events.emit('add:coin');
		this.scene.tweens.add({
				targets: this,
				y: {
					value: this.y - 50,
					duration: 750,
					ease: 'Cubic.easeOut'
				},
				alpha: {
					value: 0,
					duration: 750,
					ease: 'Cubic.easeOut'
				},
				onComplete: () => this.destroy()
		});
	}

	getRandomVelocity(){
		let min = 50;
		let max = 100;
		let v = min + (Math.random() * (max-min));
		let absV = (Math.random() >= 0.5) ? -v : v;
		return absV;
	}
}

export default Coin;