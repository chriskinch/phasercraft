import { GameObjects, Scene } from 'phaser';
import store from "@store"
import { addCrafting } from "@store/gameReducer"
import getRandomVelocity from "@helpers/getRandomVelocity"

interface CraftingConfig {
	scene: Scene;
	x: number;
	y: number;
	key: string;
}

class Crafting extends GameObjects.Sprite {
	public name: string;
	public body: Phaser.Physics.Arcade.Body;

	constructor(config: CraftingConfig) {
		super(config.scene, config.x, config.y, 'crafting', config.key);
		config.scene.physics.world.enable(this);
		config.scene.add.existing(this).setDepth((this.scene as any).depth_group.UI);

		this.name = config.key;
	
		// this.anims.play('coin');
		this.body.setVelocity(getRandomVelocity(25, 50), getRandomVelocity(25, 50)).setDrag(100);
		this.body.immovable = true;

		this.scene.time.delayedCall(500, this.activate, [], this);
		this.once('loot:collect', this.collect, this);
	}

	activate(): void {
		this.scene.physics.add.collider((this.scene as any).player, this, this.touch, undefined, this);
	}

	touch(): void {
		this.emit('loot:collect', this);
	}

	collect(): void {
		store.dispatch(addCrafting(this.name));
		console.log(store.getState().game.inventory)
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

export default Crafting;