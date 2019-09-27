import Spell from './Spell';
import targetVector from '../../Helpers/targetVector';

class Whirlwind extends Spell {
	constructor(config) {
		const defaults = {
			icon_name: 'icon_0005_coil',
			cooldown: 2,
			cost: {
				rage: 50,
				mana: 80,
				energy: 60
			},
			type: 'physical',
			range: 120,
			cap: 5
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
				enemy.vector = targetVector(this.player, enemy);
				if (enemy.vector.range < this.range) return enemy;
			})
			.sort(function (a, b) {
				return a.vector.range - b.vector.range;
			});

		// Modified if more the cap. This ensure that the spell is not massivly overpowered.
		// TODO: Abstract this capping functionality out as many spells might use.
		const mod = this.powerCap(enemiesInRange);
		// Scales value bases on player stat.
		const value = this.setValue(30, this.player.stats.attack_power);

		enemiesInRange.forEach(target => {
			target.health.adjustValue(-value.amount * mod, this.type, value.crit);
		});
	}

	powerCap(enemies) {
		const split = (enemies.length < this.cap) ? this.cap : enemies.length;
		const spread = this.cap / split;
		return spread;
	}

	animationUpdate(){
		this.x = this.player.x;
		this.y = this.player.y;
	}
}

export default Whirlwind;