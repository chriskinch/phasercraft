import { GameObjects } from 'phaser';
import store from "@store"
import { addCoins } from "@store/gameReducer"
import getRandomVelocity from "@Helpers/getRandomVelocity"

class Coin extends GameObjects.Sprite {

	constructor(config) {
		super(config.scene, config.x, config.y, 'coin-spin');
		config.scene.physics.world.enable(this);
		config.scene.add.existing(this).setDepth(this.scene.depth_group.UI);

		this.anims.play('coin');
		this.body.setVelocity(getRandomVelocity(25, 50), getRandomVelocity(25, 50)).setDrag(100);
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
		store.dispatch(addCoins(1));
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
}

export default Coin;