import { GameObjects, Display, Actions, Geom } from 'phaser';
import { toggleUi, addLoot, loadGame } from "../../store/gameReducer";
import store from '../../store';
import { from } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';

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
		this.buttons = [
			this.setInvetoryIcon(),
			this.setSystemIcon()
		];

		// Position buttons in the bottom right
		const {x, y, width, height} = this.scene.zone;
		Actions.IncXY(this.buttons, x + width, y + height, -35);

		// Subscribe and update only if coins change. Uses RxJS.
		const state$ = from(store);
		state$.pipe(
			map(state => state.coins),
			distinctUntilChanged()
		).subscribe(n => this.changeCoinCount(n));

		// Toggle menu on key binding and sub to store
		store.subscribe(() => {
			if(this.showUi !== store.getState().showUi) {
				this.showUi = store.getState().showUi;
				this.toggleMenu(this.showUi);
			}
		});
		scene.input.keyboard.on('keyup-P', () => store.dispatch(toggleUi("equipment")), this);
		// TEMP KEYBINDS
		scene.input.keyboard.on('keyup-R', () => store.dispatch(addLoot(Math.floor(Math.random() * 100))), this);

		// Saving
		const slot = store.getState().saveSlot;
		scene.input.keyboard.on('keyup-S', () => {
			console.log("GAME SAVED TO: " + store.getState().saveSlot);
			localStorage.setItem(slot, JSON.stringify(store.getState()))
		}, this);
		scene.input.keyboard.on('keyup-D', () => {
			["slot_a", "slot_b", "slot_c"].forEach(slot => {localStorage.removeItem(slot)});
		}, this);
		scene.input.keyboard.on('keyup-L', () => {
			const save_data = JSON.parse(localStorage.getItem(slot));
			save_data ? store.dispatch(loadGame(save_data)) : console.log("NO DATA TO LOAD");
		}, this);

		// this.scene.events.on('coins:add', this.changeCoinCount, this);
		// this.scene.events.on('coins:remove', this.changeCoinCount, this);
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
		this.coins.text = this.scene.add.text(15, 0, 'Coins: ', styles).setOrigin(0, 0.5);
		this.coins.add(this.coins.text);
	}

	changeCoinCount(coins){
		this.coins.text.setText('Coins: ' + coins);
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
		const button = this.scene.add.sprite(0, 0, 'icon', 'icon_0021_charm')
			.setInteractive()
			.setDepth(this.scene.depth_group.UI);

		button.on('pointerdown', () => store.dispatch(toggleUi("equipment")), this);
		return button;
	}

	setSystemIcon() {
		const button = this.scene.add.sprite(0, 0, 'icon', 'icon_0006_golem')
			.setInteractive()
			.setDepth(this.scene.depth_group.UI);
		
		button.on('pointerdown', () => store.dispatch(toggleUi("system")), this);
		return button;
	}

	toggleMenu(visible) {
		(visible) ? this.scene.scene.pause() : this.scene.scene.resume();
	}
}

export default UI;
