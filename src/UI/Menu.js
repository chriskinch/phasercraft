import { NinePatch } from '@koreez/phaser3-ninepatch';
import Hero from '../Entities/Player/Hero';

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

		this.scene.input.keyboard.on(`keydown-S`, this.toggleVisibility, this); 

		this.add(this.setBackground());
		this.add(this.setHero());
		this.setVisible(false);

		const text = this.scene.add.text(0, 0, 'Hello Worlds', { fontFamily: 'VT323' }).setScale(2);
		this.add(text);
		console.log(text);

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

	createText() {
		console.log("TEXT");

		var style = {
			font: "15px Revalia",
			fill: "#fff",
			boundsAlignH: "center",
			boundsAlignV: "middle"
		};
		
		var style2 = {
			font: "25px FerrumExtracondensed",
			fill: "#fff",
			boundsAlignH: "center",
			boundsAlignV: "middle"
		};
		
		//  The Text is positioned at 0, 100
		var text = this.scene.add.text(50, 100, "Revalia Google Font", style);
		text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
		
		var text2 = his.scene.add.text(50, 200, "Ferrum Custom Font", style2);
		text2.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
		
	}
}

export default Menu;
