import Boon from './Boon';

class Enrage extends Boon {
	constructor(config) {
		const defaults = {
			icon_name: "icon_0019_fire-wall",
			cooldown: 1,
			cost: {
				rage: 45,
				mana: 100,
				energy: 50
			},
			type: "physical",
			duration: 5000,
			value: {
				critical_chance: (bs) => bs + 30,
				attack_power: (bs) => bs * 2,
				health: {
					regen_value: (bs) => bs * 2,
					regen_rate: (bs) => bs - 0.25
				}
			}
		}

		super({ ...defaults, ...config });
	}

	effect(){
		this.player.boons.addBoon(this);
		this.player.hero.setTint(0xff3333);

		const timer_config = {
			delay: this.duration + 1,
			callback: this.clearEffect,
			callbackScope: this
		};
        this.timer = this.scene.time.addEvent(timer_config);
	}

	clearEffect() {
		if(!this.player.boons.contains(this)) this.player.hero.clearTint();
	}
}

export default Enrage;