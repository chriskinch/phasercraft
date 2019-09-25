import Boon from './Boon';

class Bandage extends Boon {
	constructor(config) {
		const defaults = {
			icon_name: "icon_0019_fire-wall",
			cooldown: 1,
			cost: {
				rage: 0,
				mana: 100,
				energy: 50
			},
			type: "physical",
			duration: 5000,
			value: {
				critical_chance: (bs) => bs+40,
				attack_power: (bs) => bs+100,
				health: {
					regen_value: (bs) => bs+15,
					regen_rate: (bs) => bs-0.25
				}
			}
		}

		super({ ...defaults, ...config });
	}

	setTargetEvents(type){
		// Call as it we click on the spell to trigger effect().
		// Acts like an instant cast on the player.
        this.focused(this.player);
	}

	effect(){
		this.player.boons.addBoon(this);
	}
    
    animation() {}

	animationUpdate(){}
}

export default Bandage;