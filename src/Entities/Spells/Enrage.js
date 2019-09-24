import Boon from './Boon';

class Enrage extends Boon {
	constructor(config) {
		const defaults = {
			icon_name: "icon_0019_fire-wall",
			cooldown: 1,
			cost: {
				rage: 5,
				mana: 100,
				energy: 50
			},
            type: "physical",
			value: {
				critical_chance: (v) => console.log(this),
				attack_power: 50,
				health: {
					regen_value: 30,
					regen_rate: 0.5
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
		this.scene.boons.addBoon(this);
		// this.player.stats.critical_chance += this.value;
		// this.player.stats.health.regen_value += this.value;
        // this.player.health.adjustRegeneration(-0.5);

        // this.player.resource.adjustValue(-this.cost[this.player.resource.type]);
	}
    
    animation() {
        console.log("OVERWRITE ANIMATION")
    }

	animationUpdate(){
		
	}
}

export default Enrage;