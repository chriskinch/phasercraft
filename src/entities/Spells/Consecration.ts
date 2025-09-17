import Spell from './Spell';
import AreaEffect from '../Weapons/AreaEffect';
import type { SpellOptions } from '@/types/game';

class Consecration extends Spell {
	public type: string;
	public range: number;
	public cap: number;
	public lifespan: number;
	public item: AreaEffect;

	constructor(config: SpellOptions) {
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
		this.type = 'magic';
		this.range = 80;
		this.cap = 5;
		this.lifespan = 15;
	}

	setCastEvents(state: 'on' | 'off'): void {
		// Call as it we click the spell to trigger effect().
		// Acts like an instant cast.
		if(state === 'on') this.castSpell();
	}

	areaEffect(): void {
		this.item = new AreaEffect(this.scene, this.player.x, this.player.y + 14, this.lifespan, this.range);
		this.item.on('enemy:area:overlap', this.effect, this);
		this.item.on('player:area:overlap', this.playerEffect, this);
	}

	effect(target?: any): void {
		if(target?.body) {
			// Scales value bases on player stat.
			const value = this.setValue({ base: 3, key: "magic_power" });
			target.health.adjustValue(-value.amount * 0.5, this.type);
		}else{
			this.areaEffect();
		}
	}

	playerEffect(): void {
		// Scales value bases on player stat.
		const value = this.setValue({ base: 5, key: "magic_power" });
		this.player.health.adjustValue(value.amount, "heal");
	}

	// Override and remove the default spell animation functions.
	setAnimation(): void {}
	animationUpdate(): void {}
	startAnimation(): void {}
}

export default Consecration;