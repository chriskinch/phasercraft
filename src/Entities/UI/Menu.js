import { NinePatch } from '@koreez/phaser3-ninepatch';
import Hero from '../Player/Hero';

class Menu extends Phaser.GameObjects.Container {
	constructor({scene, x, y}) {
		super(scene, x, y);

		this.setSize(800, 470);
		Phaser.Display.Align.In.Center(this, this.scene.zone);

		this.bounds = {
			top: this.height * -0.5,
			left: this.width * -0.5,
			bottom: this.height * 0.5,
			right: this.width * 0.5,
			padding: 42
		}

		// Events
		this.scene.input.keyboard.on(`keydown-S`, this.toggleVisibility, this); 

		// Objects
		this.add(this.setBackground());
		this.add(this.setHero());
		// We set the text once the fonts have loaded. This eveent is emitted across scenes.
		this.add(this.setText());

		// Invisible until we need it
		this.setVisible(false);

		this.scene.add.existing(this).setDepth(this.scene.depth_group.TOP);
	}

	setBackground() {
		return new NinePatch(this.scene, 0, 0, this.width, this.height, "menu-background", null, {
			top: 28, // Amount of pixels the border. If only top it's used for all.
		});
	}

	setText() {
		// Here setResolution might eat up memory
		// TODO: Find a more efficient way for pixel font style
		return this.scene.add.text(
			this.bounds.left + this.bounds.padding,
			this.bounds.top + this.bounds.padding, 
			'Anubis', 
			{ fontFamily: 'VT323' }
		).setScale(2);
	}

	setHero() {
		return new Hero({
			x: this.bounds.left + this.bounds.padding + 15,
			y: this.bounds.top + this.bounds.padding + 40,
			scene: this.scene,
			key: 'player',
		}).setOrigin(0,0).setScale(2);
	}

	toggleVisibility() {
		this.scene.children.bringToTop(this);
		this.setVisible(!this.visible);
        // (this.visible) ? this.scene.scene.pause() : this.scene.scene.resume();
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