import Spell from './Spell';
import type { SpellOptions } from '@/types/game';

interface FrostboltValue {
	speed: (baseSpeed: number) => number;
}

class Frostbolt extends Spell {
	public type: string;
	public duration: number;
	public value: FrostboltValue;
	public timer: Phaser.Time.TimerEvent;

	constructor(config: SpellOptions) {
		const defaults = {
			name: "frostbolt",
			icon_name: 'icon_0012_beam',
			cooldown: 1,
			cost: {
				rage: 20,
				mana: 35,
				energy: 25
			},
			type: 'magic',
			duration: 7,
			value: {
				speed: (bs: number) => -bs * 0.5, // Increase by 10
			}
		}

		super({ ...defaults, ...config });
		this.type = 'magic';
		this.duration = 7;
		this.value = {
			speed: (bs: number) => -bs * 0.5
		};
	}

	setCastEvents(state: 'on' | 'off'): void {
		// Elegible targets for this spell
		this.scene.events[state]('pointerdown:enemy', this.castSpell, this);
		// Event that clears the primed spell. Emitted by invalid targets.
		this.scene.events[state]('pointerdown:game', this.clearSpell, this);
		this.scene.events[state]('keypress:esc', this.clearSpell, this);
		this.scene.events[state]('pointerdown:player', this.clearSpell, this);
	}

	effect(target: any): void {
		// Returns crit boolean and modified value using spell base value.
		const value = this.setValue({ base: 35, key: "magic_power" });
		target.health.adjustValue(-value.amount, this.type, value.crit);

		target.banes.addEffect(this);
		target.monster.setTint(0x9999ff);

		const timer_config = {
			delay: this.duration * 1000 + 1, // Extra ms to ensure effect is over before clearing
			callback: this.clearEffect,
			callbackScope: this
		};
		this.timer = this.scene.time.addEvent(timer_config);
	}

	clearEffect(): void {
		// Check to confirm spell is gone from boon group before removing tint
		if(!this.target.banes.contains(this)) this.target.monster.clearTint();
	}

	animationUpdate(): void {
		this.x = this.target.x;
		this.y = this.target.y;
	}
}

export default Frostbolt;