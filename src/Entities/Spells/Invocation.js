import Boon from './Boon';

class Invocation extends Boon {
	constructor(config) {
		const defaults = {
			name: "invocation",
			icon_name: "icon_0014_haste",
			cooldown: 60,
			cost: {
				rage: 0,
				mana: 0,
				energy: 0
			},
			type: "magic",
			duration: 5,
			value: {
				resource_regen_value: (bs) => bs * 4, // Increse by 400%
				resource_regen_rate: -0.1 // Tick 0.1s more frequently
			}
        }

		super({ ...defaults, ...config });
		this.hasAnimation = false;
	}

	effect(){
		this.player.boons.addBoon(this);
		this.player.hero.setTint(0x8bc2f8);

		const timer_config = {
			delay: this.duration * 1000 + 1, // Extra ms to ensure effect is over before clearing
			callback: this.clearEffect,
			callbackScope: this
		};
        this.timer = this.scene.time.addEvent(timer_config);
        
        // Also root the player until spell is over or click to move.
        this.player.body.setMaxVelocity(0);
        this.player.root();

        this.scene.events.once('player:hit', this.clearEffect, this);
	}

	clearEffect() {
		this.player.idle();
        this.player.hero.clearTint();
        // Set player stats back to normal.
        this.player.body.setMaxVelocity(10000);
	}

	setAnimation(){}
	animationUpdate(){}
}

export default Invocation;