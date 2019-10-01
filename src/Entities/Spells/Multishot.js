import Spell from './Spell';
import targetVector from '../../Helpers/targetVector';

class Multishot extends Spell {
	constructor(config) {
		const defaults = {
			icon_name: 'icon_0005_coil',
			cooldown: 0,
			cost: {
				rage: 50,
				mana: 80,
				energy: 50
			},
			type: 'physical',
			range: 480,
			cap: 3
		}

        super({ ...defaults, ...config });
		
        this.setScale(5);
	}
    
    setCastEvents(state) {
        // Call as we click the spell i.e: instant cast.
        // Instanly triggers an off state so only do this when stae is on.
        if(state === 'on') this.castSpell();
    }

	effect(target){
		const enemiesInRange = this.scene.enemies.children.entries
			.filter(enemy => {
				enemy.vector = targetVector(this.player, enemy);
				if (enemy.vector.range < this.range) return enemy;
			})
			.sort(function (a, b) {
				return a.vector.range - b.vector.range;
            })
            .slice(0, this.cap);

		// Scales value bases on player stat.
		const value = this.setValue(30, this.player.stats.attack_power);

		enemiesInRange.forEach(enemy => {
			enemy.health.adjustValue(-value.amount, this.type, value.crit);
		});
	}

	animationUpdate(){
		// this.x = this.player.x;
		// this.y = this.player.y;
	}
}

export default Multishot;