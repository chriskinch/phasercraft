import Spell from './Spell';

class Heal extends Spell {
	constructor(config) {
		const defaults = {
			icon_name: 'icon_0015_heal',
			cooldown: 1,
			cost: {
				rage: 20,
				mana: 35,
				energy: 30
			},
			type: 'heal'
		}

		super({ ...defaults, ...config });

		// This is what the spell scales from.
		this.power = this.player.stats.magic_power;
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
		// Scales value bases on player stat
		const value = this.setValue(50, this.player.stats.magic_power);
		this.target.health.adjustValue(value.amount, this.type, value.crit);
	}

	animationUpdate(){
		this.x = this.target.x;
		this.y = this.target.y;
	}
}

export default Heal;