import Spell from './Spell';
import type { SpellOptions } from '@/types/game';

class Faith extends Spell {
	public frequency: number;
	public duration: number;
	public type: string;
	public timer: Phaser.Time.TimerEvent;

	constructor(config: SpellOptions) {
		const defaults = {
			name: "faith",
			icon_name: 'icon_0026_regen',
			cooldown: 20,
			cost: {
				rage: 15,
				mana: 30,
				energy: 20
			},
			frequency: 2,
			duration: 10,
			type: 'heal'
		}

		super({ ...defaults, ...config });
		
		this.frequency = 2;
		this.duration = 10;
		this.type = 'heal';
		
		this.scene.events.once('player:dead', this.clearEffect, this);
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
		const timer_config = {
			delay: this.frequency * 1000,
			repeat: Math.round(this.duration/this.frequency) - 1,
			callback: this.overTimeEffect,
			args: [target],
			callbackScope: this
		};
		this.timer = this.scene.time.addEvent(timer_config);
		const value = this.setValue({ base: 20, key: "magic_power" });
		target.health.adjustValue(value.amount, this.type, false);
	}
	
	overTimeEffect(target: any): void {
		// Scales value bases on player stat
		const value = this.setValue({ base: 20, key: "magic_power" });
		target.health.adjustValue(value.amount, this.type, value.crit);
	}

	clearEffect(): void {
		if(this.timer) this.timer.remove();
	}

	animationUpdate(): void {
		if (this.target && typeof this.target === 'object' && 'x' in this.target && 'y' in this.target) {
			this.x = this.target.x as number;
			this.y = this.target.y as number;
		}
	}
}

export default Faith;