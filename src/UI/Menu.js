import { NinePatch } from '@koreez/phaser3-ninepatch';
import Hero from '../Entities/Player/Hero';

const styles = {
	font: '16px monospace',
	fill: '#ffffff'
};

class Menu extends Phaser.GameObjects.Container {
	constructor(scene) {
		super(scene, 900, 470);

		this.setSize(900, 470);
		Phaser.Display.Align.In.Center(this, this.scene.zone);

		this.bounds = {
			top: this.height * -0.5,
			left: this.width * -0.5,
			bottom: this.height * 0.5,
			right: this.width * 0.5,
			padding: 28
		}

		console.log(this)

		this.scene.input.keyboard.on(`keydown-S`, this.toggleVisibility, this); 

		this.add(this.setBackground());
		this.add(this.setHero());
		this.setVisible(false);

		this.scene.add.existing(this).setDepth(this.scene.depth_group.UI);
	}

	setBackground() {
		return new NinePatch(this.scene, 0, 0, this.width, this.height, "menu-background", null, {
			top: 14, // Amount of pixels the border. If only top it's used for all.
		});
	}

	setHero() {
		return new Hero({
			x: this.bounds.left + this.bounds.padding,
			y: this.bounds.top + this.bounds.padding,
			scene: this.scene,
			key: 'player',
		}).setOrigin(0,0).setScale(2);
	}

	toggleVisibility() {
		this.scene.children.bringToTop(this);
		this.setVisible((this.visible) ? false : true);
	}
}

export default Menu;
