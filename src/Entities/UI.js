const styles = {
	font: '16px monospace',
	fill: '#ffffff'
};

class UI extends Phaser.GameObjects.Container {
	constructor(scene) {
		super(scene, 0, 0);
		this.scene.add.existing(this).setDepth(this.scene.depth_group.UI);

		this.spells = 5;
		this.spacing = 70;
		this.frames = [];

		this.setSpellFrames();
		this.setCoinCount();
		this.setWaveCount();

		this.scene.events.on('increment:coin', this.addCoinCount, this);
		this.scene.events.on('increment:wave', this.addWaveCount, this);

		var style = {
			'background-color': 'lime',
			'width': '220px',
			'height': '100px',
			'font': '48px Arial',
			'font-weight': 'bold'
		};
		var element = this.scene.add.dom(400, 300, 'div', style, 'Phaser 3');
	}

	setSpellFrames(){
		let x = Phaser.Display.Bounds.GetLeft(this.scene.zone);
		let y = Phaser.Display.Bounds.GetBottom(this.scene.zone);
		for(let i=0; i<this.spells; i++) {
			let frame = this.scene.add.sprite(x + (this.spacing*i), y, 'icon', 'icon_blank').setScale(1.8).setAlpha(0.3);
			this.add(frame);
			this.frames.push(frame);
		}
	}

	setCoinCount(){
		this.coins = this.scene.add.container(0, 0)
		Phaser.Display.Align.In.TopRight(this.coins, this.scene.zone, -80);

		this.coins.add(this.scene.add.sprite(0, 0, 'coin-spin').setDepth(this.scene.depth_group.UI));
		this.coins.text = this.scene.add.text(15, 0, 'Coins: ' +this.scene.coins, styles).setOrigin(0, 0.5);
		this.coins.add(this.coins.text);
	}

	addCoinCount(){
		this.coins.text.setText('Coins: ' +this.scene.coins);
	}

	setWaveCount(){
		this.wave = this.scene.add.container(0, 0)
		Phaser.Display.Align.In.TopRight(this.wave, this.scene.zone, -190);

		this.wave.add(this.scene.add.sprite(0, 0, 'dungeon', 'ghast_baby').setScale(2).setDepth(this.scene.depth_group.UI));
		this.wave.text = this.scene.add.text(15, 0, 'Wave: ' + (this.scene.wave+1), styles).setOrigin(0, 0.5);
		this.wave.add(this.wave.text);
	}

	addWaveCount(){
		this.wave.text.setText('Wave: ' + (this.scene.wave+1));
	}

}

export default UI;
