import Spell from './Spell';

class Smite extends Spell {
	constructor(config) {
		const defaults = {
			icon_name: 'icon_0007_bolt',
			cooldown: 1,
			cost: {
				rage: 30,
				mana: 50,
				energy: 40
			},
			type: 'magic'
		}

		super({ ...defaults, ...config });
		
		// This is what the spell scales from.
		this.power = this.player.stats.magic_power;
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
		// Returns crit boolean and modified value using spell base value.
		const value = this.setValue(30, this.player.stats.magic_power);
		this.target.health.adjustValue(-value.amount, this.type, value.crit);
	}

	animationUpdate(){
		this.x = this.target.x;
		this.y = this.target.y;
	}
}

export default Smite;