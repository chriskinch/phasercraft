import Spell from './Spell';

class Heal extends Spell {
	constructor(config) {
		config.icon_name = config.icon_name || 'icon_0015_heal';
		config.cooldown = config.cooldown || 10;
		config.value = config.value || 200;
		config.cost = config.cost || 20;

		super(config);

		// Assign button position then text position.
		Phaser.Display.Align.In.BottomLeft(this.button, this.scene.UI.frames[0]);
		Phaser.Display.Align.In.Center(this.text, this.button, -2, -2);
	}

	setTargetEvents(type){
		// Elegible targets for this spell
		this.scene.events[type]('pointerdown:player', this.cast, this);
		// Event that clears the primed spell. Emitted by invalid targets.
		this.scene.events[type]('pointerdown:game', this.out, this);
		this.scene.events[type]('keypress:esc', this.out, this);
		this.scene.events[type]('pointerdown:enemy', this.out, this);
	}

	effect(){
		this.target.health.adjustValue(this.value);
		this.player.resource.adjustValue(-this.cost);
	}

	animationUpdate(){
		this.x = this.target.x;
		this.y = this.target.y;
	}
}

export default Heal;