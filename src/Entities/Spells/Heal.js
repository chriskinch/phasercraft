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
			}
		}

		super({ ...defaults, ...config });

		// Sets value based on player power using a base value (param)
		this.value = this.setValue(50);
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
		this.target.health.adjustValue(this.value);
		this.player.resource.adjustValue(-this.cost[this.player.resource.type]);
	}

	animationUpdate(){
		this.x = this.target.x;
		this.y = this.target.y;
	}
}

export default Heal;