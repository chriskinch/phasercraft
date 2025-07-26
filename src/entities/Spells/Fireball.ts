import Spell from './Spell';

interface FireballConfig {
	scene: any;
	x: number;
	y: number;
	key: string;
	player: any;
	cost: { [key: string]: number };
	cooldown: number;
	name: string;
	icon_name: string;
	hotkey: string;
	slot: number;
	loop?: boolean;
	cooldownDelay?: boolean;
	cooldownDelayAll?: boolean;
}

class Fireball extends Spell {
	public type: string;

	constructor(config: FireballConfig) {
		const defaults = {
			name: "fireball",
			icon_name: 'icon_0017_fire-ball',
			cooldown: 1,
			cost: {
				rage: 30,
				mana: 50,
				energy: 40
			},
			type: 'magic'
		}

		super({ ...defaults, ...config });
		this.type = 'magic';
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
		const value = this.setValue({ base: 45, key: "magic_power" });
		target.health.adjustValue(-value.amount, this.type, value.crit);
	}

	animationUpdate(): void {
		this.x = this.target.x;
		this.y = this.target.y;
	}
}

export default Fireball;