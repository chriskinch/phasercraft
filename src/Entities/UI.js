class UI extends Phaser.GameObjects.Container {

	constructor(scene) {
		super(scene, 0, 0);

		this.spells = 3;
		this.spacing = 60;
		this.frames = [];
	}

	setSpellFrames(){
		for(let i=0; i<this.spells; i++) {
			this.frames.push(
				this.scene.add.sprite(0, 0, 'icon', 'frame').setDepth(this.scene.depth_group.BASE).setScale(2);
			)
			Phaser.Display.Align.In.BottomLeft(this.button, this.scene.zone);
			this.frames[i].x = this.spacing*i;
		}
	}

}

export default UI;
