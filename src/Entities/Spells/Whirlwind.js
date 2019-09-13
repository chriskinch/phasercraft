import Spell from './Spell';
import targetVector from '../../Helpers/targetVector';

class Whirlwind extends Spell {
	constructor(config) {
		const defaults = {
			icon_name: 'icon_0005_coil',
			cooldown: 1,
			cost: {
				rage: 50,
				mana: 80,
				energy: 60
			},
			type: 'physical',
			range: 120
		}

        super({ ...defaults, ...config });
		
		// This is what the spell scales from.
		this.power = this.player.stats.attack_power;
		
        this.setScale(5);
	}

	setTargetEvents(type){
		// Call as it we click on a focues target to trigger effect().
		// Acts like an instant cast.
        this.focused();
	}

	effect(){
		const enemiesInRange = this.scene.enemies.children.entries.filter(enemy => {
			const vector = targetVector(this.player, enemy);
			if (vector.range < this.range) return enemy;
		})
		// Scales value bases on player stat
		const value = this.setValue(30, this.power);
		enemiesInRange.forEach(target => {
			target.health.adjustValue(-value.amount, this.type, value.crit);
		});
        this.player.resource.adjustValue(-this.cost[this.player.resource.type]);
	}

	animationUpdate(){
		this.x = this.player.x;
		this.y = this.player.y;
	}
}

export default Whirlwind;