class UI extends Phaser.GameObjects.Container {

	constructor(scene) {
		super(scene, 0, 0);
		this.scene.add.existing(this);

		this.spells = 5;
		this.spacing = 70;
		this.frames = [];

		this.setSpellFrames();
	}

	setSpellFrames(){
		let x = Phaser.Display.Bounds.GetLeft(this.scene.zone);
		let y = Phaser.Display.Bounds.GetBottom(this.scene.zone);
		for(let i=0; i<this.spells; i++) {
			let frame = this.scene.add.sprite(x + (this.spacing*i), y, 'icon', 'icon_blank').setOrigin(0.25,0.75).setDepth(this.scene.depth_group.BASE).setScale(1.8).setAlpha(0.3);
			this.add(frame);
			this.frames.push(frame);
		}
	}

}

export default UI;
