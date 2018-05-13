class UI extends Phaser.GameObjects.Container {

	constructor(scene) {
		super(scene, 0, 0);
		this.scene.add.existing(this).setDepth(this.scene.depth_group.UI);

		this.spells = 5;
		this.spacing = 70;
		this.frames = [];

		this.setSpellFrames();
		this.setCoinCount();

		this.scene.events.on('add:coin', this.addCoinCount, this);
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
		let styles = {
			font: '16px monospace',
			fill: '#ffffff'
		};

		this.coins = this.scene.add.container(0, 0)
		Phaser.Display.Align.In.TopRight(this.coins, this.scene.zone);

		this.coins.add(this.scene.add.sprite(0, 0, 'coin-spin').setDepth(this.scene.depth_group.UI));
		this.coins.text = this.scene.add.text(15, 0, this.scene.coins, styles).setOrigin(0, 0.5);
		this.coins.add(this.coins.text);
	}

	addCoinCount(){
		this.coins.text.setText(this.scene.coins);
	}

}

export default UI;
