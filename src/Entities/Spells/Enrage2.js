import Boon from './Boon';

class Enrage2 extends Boon {
	constructor(config) {
		const defaults = {
			name: "enrage2",
			icon_name: "icon_0019_fire-wall",
			cooldown: 10,
			cost: {
				rage: 0,
				mana: 80,
				energy: 30
			},
			type: "physical",
			duration: 5,
			value: {
				critical_chance: (bs) => bs + 10,
				magic_power: (bs) => bs * 1.2,
				health_regen_value: (bs) => bs * 2,
				health_regen_rate: (bs) => bs - 0.25
			}
		}

		super({ ...defaults, ...config });

		this.hasAnimation = false;
	}

	effect(){
		this.player.boons.addBoon(this);
		this.player.hero.setTint(0xff3333);

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

export default Enrage2;