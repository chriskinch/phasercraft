import Spell from './Spell';

class Heal extends Spell {
	constructor(config) {
		const defaults = {
			name: "heal",
			icon_name: 'icon_0015_heal',
			cooldown: 3,
			cost: {
				rage: 20,
				mana: 35,
				energy: 30
			},
			type: 'heal'
		}

		super({ ...defaults, ...config });
	}

	setCastEvents(state){
		// Elegible targets for this spell
		this.scene.events[state]('pointerdown:player', this.castSpell, this);
		// Event that clears the primed spell. Emitted by invalid targets.
		this.scene.events[state]('pointerdown:game', this.clearSpell, this);
		this.scene.events[state]('keypress:esc', this.clearSpell, this);
		this.scene.events[state]('pointerdown:enemy', this.clearSpell, this);
	}

	effect(target){
		// Scales value bases on player stat
		const value = this.setValue({ base: 130, key: "magic_power" });
		target.health.adjustValue(value.amount, this.type, value.crit);
	}

	animationUpdate(){
		this.x = this.target.x;
		this.y = this.target.y;
	}
}

export default Heal;