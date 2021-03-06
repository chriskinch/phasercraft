import Spell from './Spell';

class Smite extends Spell {
	constructor(config) {
		const defaults = {
			name: "smite",
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
		const value = this.setValue({ base: 30, key: "magic_power" });
		const heal = this.setValue({ base: 15, key: "magic_power" });
		this.player.health.adjustValue(heal.amount, 'heal', heal.crit);
		target.health.adjustValue(-value.amount, this.type, value.crit);
	}

	animationUpdate(){
		this.x = this.target.x;
		this.y = this.target.y - 40;
	}
}

export default Smite;