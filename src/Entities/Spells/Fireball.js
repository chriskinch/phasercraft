import Spell from './Spell';

class Fireball extends Spell {
	constructor(config) {
		const defaults = {
			icon_name: 'icon_0017_fire-ball',
			cooldown: 1,
			value: 100,
			cost: {
				rage: 30,
				mana: 40,
				energy: 40
			}
		}

		super({ ...defaults, ...config });
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
		this.player.resource.adjustValue(-this.cost[this.player.resource.type]);
	}

	animationUpdate(){
		this.x = this.target.x;
		this.y = this.target.y;
	}
}

export default Fireball;