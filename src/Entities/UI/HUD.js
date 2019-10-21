import { GameObjects, Display } from 'phaser';
import { toggleUi } from "../../store/gameReducer";
import store from '../../store';

const styles = {
	font: '12px monospace',
	fill: '#ffffff'
};

class UI extends GameObjects.Container {
	constructor(scene) {
		super(scene, 0, 0);
		
		this.spells = 5;
		this.spacing = 60;
		this.frames = [];

		this.setSpellFrames();
		this.setCoinCount();
		this.setWaveCount();
		Object.assign(this, this.setInvetoryIcon());

		// Toggle menu on key binding
		scene.input.keyboard.on(`keydown-S`, this.toggleMenu, this);

		this.scene.events.on('increment:coin', this.addCoinCount, this);
		this.scene.events.on('increment:wave', this.addWaveCount, this);

		this.scene.add.existing(this).setDepth(this.scene.depth_group.UI);
	}

	setSpellFrames(){
		let x = Display.Bounds.GetLeft(this.scene.zone);
		let y = Display.Bounds.GetBottom(this.scene.zone);
		for(let i=0; i<this.spells; i++) {
			let frame = this.scene.add.sprite(x + (this.spacing*i), y, 'icon', 'icon_blank').setAlpha(0.3).setScale(1.5);
			this.add(frame);
			this.frames.push(frame);
		}
	}

	setCoinCount(){
		this.coins = this.scene.add.container(0, 0)
		Display.Align.In.TopRight(this.coins, this.scene.zone, -80);

		this.coins.add(this.scene.add.sprite(0, 0, 'coin-spin').setDepth(this.scene.depth_group.UI));
		this.coins.text = this.scene.add.text(15, 0, 'Coins: ' +this.scene.coins, styles).setOrigin(0, 0.5);
		this.coins.add(this.coins.text);
	}

	addCoinCount(){
		this.coins.text.setText('Coins: ' +this.scene.coins);
	}

	setWaveCount(){
		this.wave = this.scene.add.container(0, 0)
		Display.Align.In.TopRight(this.wave, this.scene.zone, -190);

		this.wave.add(this.scene.add.sprite(0, 0, 'dungeon', 'ghast_baby').setDepth(this.scene.depth_group.UI));
		this.wave.text = this.scene.add.text(15, 0, 'Wave: ' + (this.scene.wave+1), styles).setOrigin(0, 0.5);
		this.wave.add(this.wave.text);
	}

	addWaveCount(){
		this.wave.text.setText('Wave: ' + (this.scene.wave+1));
	}

	setInvetoryIcon() {
		const menu_button = this.scene.add.sprite(0, 0, 'icon', 'icon_0021_charm')
			.setInteractive()
			.setDepth(this.scene.depth_group.UI);

		Display.Align.In.BottomRight(menu_button, this.scene.zone);
		
		menu_button.on('pointerdown', this.toggleMenu, this);
		
		return {menu_button: menu_button};
	}

	toggleMenu() {
		store.dispatch(toggleUi({menu: "equipment"}));		
		//const scene_manager = this.scene.scene;
		//(this.visible) ? scene_manager.pause() : scene_manager.resume();
	}
}

export default UI;
