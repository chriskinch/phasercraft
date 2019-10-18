import { GameObjects, Display } from 'phaser';
import Menu from './Menu';

const styles = {
	font: '12px monospace',
	fill: '#ffffff'
};

class UI extends GameObjects.Container {
	constructor(scene) {
		super(scene, 0, 0);
		const { centerX, centerY } = this.scene.physics.world.bounds;

		this.spells = 5;
		this.spacing = 40;
		this.frames = [];

		this.setSpellFrames();
		this.setCoinCount();
		this.setWaveCount();

		this.scene.events.on('increment:coin', this.addCoinCount, this);
		this.scene.events.on('increment:wave', this.addWaveCount, this);

		this.menu = new Menu({scene: scene, x:centerX, y:centerY, key:'S'}).createFromCache('menu').addListener('click');
		this.add(this.menu);

		this.scene.add.existing(this).setDepth(this.scene.depth_group.UI);
	}

	setSpellFrames(){
		let x = Display.Bounds.GetLeft(this.scene.zone);
		let y = Display.Bounds.GetBottom(this.scene.zone);
		for(let i=0; i<this.spells; i++) {
			let frame = this.scene.add.sprite(x + (this.spacing*i), y, 'icon', 'icon_blank').setAlpha(0.3);
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

}

export default UI;
