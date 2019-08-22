const styles = {
	font: '16px monospace',
	fill: '#ffffff'
};

class Menu extends Phaser.GameObjects.Container {
	constructor(scene) {
		super(scene, 0, 0);
		this.scene.add.existing(this).setDepth(this.scene.depth_group.UI);
		
		console.log("MENU")

		// const menu = this.scene.add.sprite(10, 20, 'menu-ui');

		const menu = this.scene.add.ninePatch(0, 0, 500, 400, "menu-background", null, {
			top: 14
		});

		Phaser.Display.Align.In.Center(menu, this.scene.zone);
	}
}

export default Menu;
