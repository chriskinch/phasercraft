import Spell from './Spell';

class Heal extends Spell {
	constructor(config) {
		config.icon_name = config.icon_name || 'icon_0015_heal';
		config.cooldown = config.cooldown || 10;
		config.value = config.value || 200;

		super(config);
	}

	setTargetEvents(type){
		// Elegible targets for this spell
		this.scene.events[type]('pointerdown:player', this.focused, this);
		// Event that clears the primed spell. Emitted by invalid targets.
		this.scene.events[type]('pointerdown:game', this.clear, this);
		this.scene.events[type]('keypress:esc', this.clear, this);
		this.scene.events[type]('pointerdown:enemy', this.clear, this);
	}

	effect(){
		if(this.target.health) this.target.health.adjustValue(this.value);
	}

	animationUpdate(){
		this.x = this.target.x;
		this.y = this.target.y;
	}
}

export default Heal;