import Spell from './Spell';

class Smite extends Spell {
	constructor(config) {
		const defaults = {
			icon_name: 'icon_0007_bolt',
			cooldown: 3,
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

	setCastEvents(state){
		// Elegible targets for this spell
		this.scene.events[state]('pointerdown:enemy', this.castSpell, this);
		// Event that clears the primed spell. Emitted by invalid targets.
		this.scene.events[state]('pointerdown:game', this.clearSpell, this);
		this.scene.events[state]('keypress:esc', this.clearSpell, this);
		this.scene.events[state]('pointerdown:player', this.clearSpell, this);
	}

	effect(target){
		// Returns crit boolean and modified value using spell base value.
		const value = this.setValue(30, this.player.stats.magic_power);
		const heal = this.setValue(15, this.player.stats.magic_power);
		this.player.health.adjustValue(heal.amount, 'heal', heal.crit);
		target.health.adjustValue(-value.amount, this.type, value.crit);
	}

	animationUpdate(){
		console.log(this)
		this.x = this.target.x;
		this.y = this.target.y - 40;
	}
}

export default Smite;