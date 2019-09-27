import Spell from './Spell';
import targetVector from '../../Helpers/targetVector';

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
			type: 'physical',
			range: 120
		}

        super({ ...defaults, ...config });
		
        this.setScale(5);
	}

	setTargetEvents(type){
		// Call as it we click the spell to trigger effect().
		// Acts like an instant cast.
        this.focused();
	}

	effect(){
		const enemiesInRange = this.scene.enemies.children.entries
			.filter(enemy => {
				const vector = targetVector(this.player, enemy);
				if (vector.range < this.range) return enemy;
			})
			.sort(function (a, b) {
				const vector = targetVector(this.player, enemy);
				return a.vector < b.vector;
			});
		console.log(enemiesInRange)
		// Scales value bases on player stat
		const value = this.setValue(30, this.player.stats.attack_power);

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