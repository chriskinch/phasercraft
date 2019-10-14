import { NinePatch } from '@koreez/phaser3-ninepatch';
import Hero from '../Player/Hero';

const UppercaseFirst = Phaser.Utils.String.UppercaseFirst;

class Menu extends Phaser.GameObjects.Container {
	constructor({scene, x, y}) {
		super(scene, x, y);

		this.setSize(800, 470);
		Phaser.Display.Align.In.Center(this, this.scene.zone);

		const padding = 42;
		this.bounds = {
			top: this.height * -0.5 + padding,
			left: this.width * -0.5 + padding,
			bottom: this.height * 0.5 + padding,
			right: this.width * 0.5 + padding,
			padding: padding
		}

		// Events
		this.scene.input.keyboard.on(`keydown-S`, this.toggleVisibility, this); 

		// Objects
		this.add(this.setBackground());
		this.add(this.setHero({x:this.bounds.left, y:this.bounds.top + 60}).setScale(5).setOrigin(0.5));

		// Invisible until we need it
		this.setVisible(false);

		this.scene.add.existing(this).setDepth(this.scene.depth_group.TOP);

		this.player = scene.player;
	}

	setBackground() {
		return new NinePatch(this.scene, 0, 0, this.width, this.height, "menu-background", null, {
			top: 28, // Amount of pixels the border. If only top it's used for all.
		});
	}

	setStats() {
		const { health, resource, ...stats } = this.player.stats;
		const stat_keys = Object.keys(stats).map(s => UppercaseFirst(s.replace('_', ' ') + ':'));
		const stat_values = Object.values(stats);
		console.log(stat_keys)
		// Here setResolution might eat up memory
		var haiku2 = "Green hat, Master Sword\nMonsters and chickens beware\nMoney making game";

		this.add(this.setText("Level 1", { align: 'right' }));
		this.add(this.setText(stat_keys, { align: 'right', oleft: 150, otop:40 }));
		this.add(this.setText(stat_values, { align: 'left', oleft: 320, otop:40 }));
	}

	setText(text, {align = 'left', oleft = 0, otop = 0} ) {
		// TODO: Find a more efficient way for pixel font style
		return this.scene.add.text(
			this.bounds.left + oleft,
			this.bounds.top + otop, 
			text, 
			{ 
				fontFamily: 'VT323',
				align: align
			}
		).setScale(1.5);
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
		this.player = this.scene.player;
		// We set the text once the fonts have loaded. This eveent is emitted across scenes.
		this.setStats();

		this.scene.children.bringToTop(this);
		this.setVisible(!this.visible);
        (this.visible) ? this.scene.scene.pause() : this.scene.scene.resume();
    }
}

export default Menu;