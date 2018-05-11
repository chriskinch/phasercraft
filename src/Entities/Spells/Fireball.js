import Spell from './Spell';

class Fireball extends Spell {
	constructor(config) {
		config.icon_name = config.icon_name || 'icon_0017_fire-ball';
		config.cooldown = config.cooldown || 7;
		config.value = config.value || 100;
		config.cost = config.cost || 30;

		super(config);

		// Assign button position then text position.
		Phaser.Display.Align.In.BottomLeft(this.button, this.scene.UI.frames[1]);
		Phaser.Display.Align.In.Center(this.text, this.button, -2, -2);
	}

	setTargetEvents(type){
		// Elegible targets for this spell
		this.scene.events[type]('pointerdown:enemy', this.focused, this);
		// Event that clears the primed spell. Emitted by invalid targets.
		this.scene.events[type]('pointerdown:game', this.clear, this);
		this.scene.events[type]('keypress:esc', this.clear, this);
		this.scene.events[type]('pointerdown:player', this.clear, this);
	}

	effect(){
		this.target.health.adjustValue(-this.value);
		this.player.resource.adjustValue(-this.cost);
	}

	animationUpdate(){
		this.x = this.target.x;
		this.y = this.target.y;
	}
}

export default Fireball;