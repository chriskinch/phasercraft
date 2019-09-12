import Spell from './Spell';

class Whirlwind extends Spell {
	constructor(config) {
		const defaults = {
			icon_name: 'icon_0005_coil',
			cooldown: 1,
			cost: {
				rage: 0,
				mana: 80,
				energy: 60
			},
			type: 'magic',
		}

        super({ ...defaults, ...config });
        
        this.setScale(4);
	}

	setTargetEvents(type){
        console.log("HELLO");
        this.enable()
        this.emit('cast', this);
		// // Elegible targets for this spell
        // this.scene.events[type]('pointerdown:enemy', this.focused, this);
		// // Event that clears the primed spell. Emitted by invalid targets.
		// this.scene.events[type]('pointerdown:game', this.clear, this);
		// this.scene.events[type]('keypress:esc', this.clear, this);
		// this.scene.events[type]('pointerdown:player', this.clear, this);
	}

	effect(){
        console.log("EFFECT")
		// Returns crit boolean and modified value using spell base value.
		const value = this.setValue(30);
		// this.target.health.adjustValue(-value.amount, this.type, value.crit);
        this.player.resource.adjustValue(-this.cost[this.player.resource.type]);
	}

	animationUpdate(){
		this.x = this.player.x;
		this.y = this.player.y;
	}
}

export default Whirlwind;