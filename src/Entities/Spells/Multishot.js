import SpellRework from './SpellRework';
import targetVector from '../../Helpers/targetVector';

class Multishot extends SpellRework {
	constructor(config) {
		const defaults = {
			icon_name: 'icon_0005_coil',
			cooldown: 1,
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

	setTargetEvents(type){
        console.log("SET TARGET EVENTS", type)
		// Call as it we click the spell to trigger effect().
        // Acts like an instant cast.
        this.focused();
        // this.scene.time.delayedCall(1000, () => this.focused(), [], this);
        // this.scene.events[type]('pointerdown:game', this.focused, this);
        // this.scene.events[type]('pointerdown:game', this.clear, this);
    }
    
    setCastEvents(state) {
        console.log("SET TARGET EVENTS", state);
        this.castSpell();
    }

	effect(){
        console.log("EFFECT: ", this)
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

		enemiesInRange.forEach(target => {
			target.health.adjustValue(-value.amount, this.type, value.crit);
		});
	}

	animationUpdate(){
		// this.x = this.player.x;
		// this.y = this.player.y;
	}
}

export default Multishot;