import Spell from './Spell';
import targetVector from '../../Helpers/targetVector';

class Multishot extends Spell {
	constructor(config) {
		const defaults = {
			name: "multishot",
			icon_name: 'icon_0004_corpse-explode',
			cooldown: 0,
			cost: {
				rage: 50,
				mana: 100,
				energy: 60
			},
			type: 'physical',
			range: 360,
			cap: 3
		}

		super({ ...defaults, ...config });
	}
    
    setCastEvents(state) {
        // Call as we click the spell i.e: instant cast.
        // Instanly triggers an off state so only do this when state is on.
		if(state === 'on') this.castSpell();
    }

	effect(target){
		// Scales value bases on player stat.
		if(target) {
			const value = this.setValue(30, this.player.stats.attack_power);
			target.health.adjustValue(-value.amount, this.type, value.crit);
		}
	}

	startAnimation() {
		const enemiesInRange = this.scene.enemies.children.entries
			.filter(enemy => {
				enemy.vector = targetVector(this.player, enemy);
				if (enemy.vector.range < this.range) return enemy;
				return null;
			})
			.sort(function (a, b) {
				return a.vector.range - b.vector.range;
            })
			.slice(0, this.cap);
			
		enemiesInRange.forEach(enemy => {
			this.target = enemy;
			this.effect(enemy);

			const animation = this.scene.add.sprite(100, 100, 'multishot-effect')
				.anims.play('multishot-animation')
				.setDepth(1000)
				.on('animationupdate', () => {
					this.animationUpdate(animation, enemy);
				});
		});
	}

	animationUpdate(effect, target){
		effect.x = target.x;
		effect.y = target.y;
	}
}

export default Multishot;