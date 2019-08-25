const styles = {
	font: '16px monospace',
	fill: '#ffffff'
};

class Menu extends Phaser.GameObjects.Container {
	constructor(scene) {
		super(scene, 0, 0);
		this.scene.add.existing(this).setDepth(this.scene.depth_group.UI);
		
		console.log("MENU")
		this.scene.input.keyboard.on(`keydown-S`, this.toggleMenu, this); 

		// const menu = this.scene.add.sprite(10, 20, 'menu-ui');
	}

	setMenu() {
		const menu = this.scene.add.ninePatch(0, 0, 500, 400, "menu-background", null, { top: 14 }).setDepth(this.scene.depth_group.TOP);
		Phaser.Display.Align.In.Center(menu, this.scene.zone);

		return menu;
	}

	removeMenu() {
		this.menu.destroy();
		return null;
	}

	toggleMenu() {
		console.log(this.menu);
		this.menu = (this.menu) ? this.removeMenu() : this.setMenu(); 
	}
}

export default Menu;
