import Boon from './Boon';

interface PowerInfusionConfig {
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

interface PowerInfusionValue {
	critical_chance: number;
	attack_power: (baseAttackPower: number) => number;
	magic_power: (baseMagicPower: number) => number;
	speed: (baseSpeed: number) => number;
	resource_regen_value: (baseRegenValue: number) => number;
	resource_regen_rate: number;
}

class PowerInfusion extends Boon {
	public type: string;
	public duration: number;
	public value: PowerInfusionValue;
	public timer: Phaser.Time.TimerEvent;

	constructor(config: PowerInfusionConfig) {
		const defaults = {
			name: "powerinfusion",
			icon_name: "icon_0009_blind",
			cooldown: 30,
			cost: {
				rage: 20,
				mana: 100,
				energy: 40
			},
			type: "magical",
			duration: 15,
			value: {
				critical_chance: 10, // Increase by 10
				attack_power: (bs: number) => bs * 0.2, // Increase by 20%
				magic_power: (bs: number) => bs * 0.2, // Increase by 20%
				speed: (bs: number) => bs * 0.1, // Increase by 10%;
				resource_regen_value: (bs: number) => bs * 0.3, // Increase by 30%
				resource_regen_rate: -0.1 // Tick 0.1s more frequently
			}
		}

		super({ ...defaults, ...config });

		this.hasAnimation = false;
		this.type = "magical";
		this.duration = 15;
		this.value = {
			critical_chance: 10,
			attack_power: (bs: number) => bs * 0.2,
			magic_power: (bs: number) => bs * 0.2,
			speed: (bs: number) => bs * 0.1,
			resource_regen_value: (bs: number) => bs * 0.3,
			resource_regen_rate: -0.1
		};
	}
	
	setCastEvents(state: 'on' | 'off'): void {
		// Elegible targets for this spell
		this.scene.events[state]('pointerdown:player', this.castSpell, this);
		// Event that clears the primed spell. Emitted by invalid targets.
		this.scene.events[state]('pointerdown:game', this.clearSpell, this);
		this.scene.events[state]('keypress:esc', this.clearSpell, this);
		this.scene.events[state]('pointerdown:enemy', this.clearSpell, this);
	}

	effect(): void {
		this.player.boons.addEffect(this);
		this.player.hero.setTint(0xffff66);

		const timer_config = {
			delay: this.duration * 1000 + 1, // Extra ms to ensure effect is over before clearing
			callback: this.clearEffect,
			callbackScope: this
		};
		this.timer = this.scene.time.addEvent(timer_config);
	}

	clearEffect(): void {
		// Check to confirm spell is gone from boon group before removing tint
		if(!this.player.boons.contains(this)) this.player.hero.clearTint();
	}

	setAnimation(): void {}
	animationUpdate(): void {}
}

export default PowerInfusion;