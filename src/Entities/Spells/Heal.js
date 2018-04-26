class Heal extends Phaser.GameObjects.Sprite{

	constructor(config) {
		super(config.scene, config.x, config.y, config.key);
		//config.scene.add.existing(this);
		this.cooldown = 10000;
		this.value = 200;
		this.ready();
	}

	cast(target){
		target.health.adjustValue(this.value);
		this.scene.time.delayedCall(this.cooldown, this.ready, [], this);
	}

	ready() {
		this.scene.events.once('heal', (target) => {
			console.log(target);
			this.cast(target);
		});
	}
}

export default Heal;