import Boon from './Boon';

class Enrage extends Boon {
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
			duration: 10000,
			value: {
				critical_chance: (bs) => bs+40,
				attack_power: (bs) => bs+100,
				// health: {
				// 	regen_value: (bs) => bs+15,
				// 	regen_rate: (bs) => bs-0.25
				// }
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
		this.scene.time.delayedCall(this.duration, this.player.boons.removeBoon, [this], this.player.boons);

		this.player.boons.addBoon(this);
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