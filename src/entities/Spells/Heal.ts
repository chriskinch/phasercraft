import Spell from './Spell';
import type { SpellOptions } from '@/types/game';

class Heal extends Spell {
	public type: string;

	constructor(config: SpellOptions) {
		const defaults = {
			name: "heal",
			icon_name: 'icon_0015_heal',
			cooldown: 5,
			cost: {
				rage: 25,
				mana: 40,
				energy: 30
			},
			type: 'heal'
		}

		super({ ...defaults, ...config });
		this.type = 'heal';
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
		// Scales value bases on player stat
		const value = this.setValue({ base: 150, key: "magic_power" });
		target.health.adjustValue(value.amount, this.type, value.crit);
	}

	animationUpdate(): void {
		this.x = this.target.x;
		this.y = this.target.y;
	}
}

export default Heal;