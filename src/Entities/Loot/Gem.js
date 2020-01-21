import { GameObjects } from 'phaser';
import store from "../../store"
import { addCoins } from "../../store/gameReducer"

class Gem extends GameObjects.Sprite {

	constructor(config) {
		super(config.scene, config.x, config.y, 'gem-shine');
		config.scene.physics.world.enable(this);
		config.scene.add.existing(this).setDepth(this.scene.depth_group.UI);

		console.log(this.anims)
		// this.anims.play('gem');
		this.body.setVelocity(this.getRandomVelocity(), this.getRandomVelocity()).setDrag(100);
		this.body.immovable = true;

		this.scene.time.delayedCall(500, this.activate, [], this);
        this.once('loot:collect', this.collect, this);
        this.setScale(0.5)
	}

	activate(){
		this.scene.physics.add.collider(this.scene.player, this, this.touch, null, this);
	}

	touch(){
		this.emit('loot:collect', this);
	}

	collect(){
		store.dispatch(addCoins(5));
		this.scene.tweens.add({
				targets: this,
				y: {
					value: this.y - 25,
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
		let min = 25;
		let max = 50;
		let v = min + (Math.random() * (max-min));
		let absV = (Math.random() >= 0.5) ? -v : v;
		return absV;
	}
}

export default Gem;