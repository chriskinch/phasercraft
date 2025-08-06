import Spell from './Spell';
import type { SpellOptions } from '@/types/game';

class ManaShield extends Spell {
	public type: string;

	constructor(config: SpellOptions) {
		const defaults = {
			name: "manashield",
			icon_name: 'icon_0011_freeze',
			cooldown: 10,
			cost: {
				rage: 75,
				mana: 120,
				energy: 70
			},
			type: 'magic',
			cooldownDelay: true,
			loop: true
		}
		super({ ...defaults, ...config });
		this.setTint(0x8bc2f8).setAlpha(0.5);
		this.type = 'magic';
	}

	setCastEvents(state: 'on' | 'off'): void {
		// Elegible targets for this spell
		this.scene.events[state]('pointerdown:player', this.castSpell, this);
		// Event that clears the primed spell. Emitted by invalid targets.
		this.scene.events[state]('pointerdown:game', this.clearSpell, this);
		this.scene.events[state]('keypress:esc', this.clearSpell, this);
		this.scene.events[state]('pointerdown:enemy', this.clearSpell, this);
	}

	effect(target: any): void {
		this.setVisible(true);
		// Scales value bases on player stat
		const value = this.setValue({ base: 130, key: "magic_power" });
		target.shield.adjustValue(value.amount);
		target.shield.once('shield:depleted', this.end, this);
	}

	end(): void {
		this.cooldownTimer = this.setCooldown();
		this.monitorSpell();
		this.setVisible(false);
	}

	animationUpdate(): void {
		this.x = this.target.x;
		this.y = this.target.y;
	}
}

export default ManaShield;