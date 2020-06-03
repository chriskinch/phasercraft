import Spell from './Spell';
import AreaEffect from '../Weapons/AreaEffect';

class Consecration extends Spell {
	constructor(config) {
		const defaults = {
			name: "consecration",
			icon_name: 'icon_0003_decay',
			cooldown: 30,
			cost: {
				rage: 60,
				mana: 100,
				energy: 70
			},
			type: 'magic',
			range: 80,
			cap: 5,
			lifespan: 15
        }
        
		super({ ...defaults, ...config });

		this.hasAnimation = false;
    }

	setCastEvents(state) {
		// Call as it we click the spell to trigger effect().
		// Acts like an instant cast.
        if(state === 'on') this.castSpell();
    }

    areaEffect() {
		this.item = new AreaEffect(this.scene, this.player.x, this.player.y + 14, this.lifespan, this.range);
		this.item.on('area:overlap', this.effect, this);
    }

	effect(target){
		// console.log(target?.key)
		if(target?.body) {
			// Scales value bases on player stat.
			const value = this.setValue({ base: 3, key: "magic_power" });
			target.health.adjustValue(-value.amount * 0.5, this.type);
		}else{
			this.areaEffect();
		}
	}

	// Override and remove the defaul spell animation functions.
	setAnimation(){}
	animationUpdate(){}
	startAnimation(){}
}

export default Consecration;