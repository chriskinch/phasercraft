import Boon from './Boon';

class PowerInfusion extends Boon {
	constructor(config) {
		const defaults = {
			name: "powerinfusion",
			icon_name: "icon_0009_blind",
			cooldown: 30,
			cost: {
				rage: 20,
				mana: 100,
				energy: 40
			},
			type: "magical",
			duration: 15,
			value: {
				critical_chance: 10, // Increse by 10
				attack_power: (bs) => bs * 0.2, // Increse by 20%
				magic_power: (bs) => bs * 0.2, // Increse by 20%
                speed: (bs) => bs * 0.1, // Increase by 10%;
                resource_regen_value: (bs) => bs * 0.3, // Increse by 30%
                resource_regen_rate: -0.1 // Tick 0.1s more frequently
			}
		}

		super({ ...defaults, ...config });

		this.hasAnimation = false;
    }
    
    setCastEvents(state){
		// Elegible targets for this spell
		this.scene.events[state]('pointerdown:player', this.castSpell, this);
		// Event that clears the primed spell. Emitted by invalid targets.
		this.scene.events[state]('pointerdown:game', this.clearSpell, this);
		this.scene.events[state]('keypress:esc', this.clearSpell, this);
		this.scene.events[state]('pointerdown:enemy', this.clearSpell, this);
	}

	effect(){
		this.player.boons.addBoon(this);
		this.player.hero.setTint(0xffff66);

		const timer_config = {
			delay: this.duration * 1000 + 1, // Extra ms to ensure effect is over before clearing
			callback: this.clearEffect,
			callbackScope: this
		};
		this.timer = this.scene.time.addEvent(timer_config);
	}

	clearEffect() {
		// Check to confirm spell is gone from boon group before removing tint
		if(!this.player.boons.contains(this)) this.player.hero.clearTint();
	}

	setAnimation(){}
	animationUpdate(){}
}

export default PowerInfusion;