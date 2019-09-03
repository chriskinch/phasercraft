import Spell from './Spell';

class Fireball extends Spell {
	constructor({player, scene, x, y, hotkey, slot, cost = 30}) {
		const key = 'spell-fireball';
		const icon_name = 'icon_0017_fire-ball';
		const cooldown = 1;
		const value = 100;

		super({player, scene, x, y, slot, key, icon_name, cooldown, cost, value, hotkey, slot});
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