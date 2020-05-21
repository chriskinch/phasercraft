import Spell from './Spell';
import targetVector from '../../Helpers/targetVector';
import AreaEffect from '../Weapons/AreaEffect';

class Consecration extends Spell {
	constructor(config) {
		const defaults = {
			name: "consecration",
			icon_name: 'icon_0003_decay',
			cooldown: 2,
			cost: {
				rage: 50,
				mana: 80,
				energy: 60
			},
			type: 'magic',
			range: 120,
			cap: 5
        }
        
        super({ ...defaults, ...config });
    }
    
    // Override and remove the defaul spell animation functions.
    setAnimation(){}
    startAnimation() {}

	setCastEvents(state) {
		// Call as it we click the spell to trigger effect().
		// Acts like an instant cast.
        if(state === 'on') this.castSpell();
    }

    areaEffect() {
        const pointer = this.scene.input.activePointer;
		this.item = new AreaEffect(this.scene, this.player.x, this.player.y + 14, this.lifespan);
		this.item.once('area:collide', this.effect, this);
    }

	effect(target){
		console.log(target)
		if(target?.body) {
			const enemiesInRange = this.scene.enemies.children.entries
			.filter(enemy => {
				enemy.vector = targetVector(this.player, enemy);
				if (enemy.vector.range < this.range) return enemy;
				return null;
			})
			.sort(function (a, b) {
				return a.vector.range - b.vector.range;
			});

			// Modified if more the cap. This ensure that the spell is not massivly overpowered.
			// TODO: Abstract this capping functionality out as many spells might use.
			const mod = this.powerCap(enemiesInRange);
			// Scales value bases on player stat.
			const value = this.setValue({ base: 30, key: "attack_power" });

			enemiesInRange.forEach(target => {
				target.health.adjustValue(-value.amount * mod, this.type, value.crit);
			});
		}else{
			this.areaEffect();
		}
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

export default Consecration;