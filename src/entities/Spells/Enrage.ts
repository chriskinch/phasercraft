import Boon from './Boon';

interface EnrageConfig {
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

interface EnrageValue {
	critical_chance: number;
	attack_power: (baseAttackPower: number) => number;
	health_regen_value: (baseRegenValue: number) => number;
	health_regen_rate: number;
}

class Enrage extends Boon {
	public type: string;
	public duration: number;
	public value: EnrageValue;
	public timer: Phaser.Time.TimerEvent;

	constructor(config: EnrageConfig) {
		const defaults = {
			name: "enrage",
			icon_name: "icon_0019_fire-wall",
			cooldown: 10,
			cost: {
				rage: 10,
				mana: 80,
				energy: 30
			},
			type: "physical",
			duration: 5,
			value: {
				critical_chance: 10, // Increase by 10
				attack_power: (bs: number) => bs * 0.2, // Increase by 20%
				health_regen_value: (bs: number) => bs, // Increase by 100%
				health_regen_rate: -0.25 // Tick 0.25s more frequently
			}
		}

		super({ ...defaults, ...config });

		this.hasAnimation = false;
		this.type = "physical";
		this.duration = 5;
		this.value = {
			critical_chance: 10,
			attack_power: (bs: number) => bs * 0.2,
			health_regen_value: (bs: number) => bs,
			health_regen_rate: -0.25
		};
	}

	effect(): void {
		this.player.boons.addEffect(this);
		this.player.hero.setTint(0xff3333);

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

export default Enrage;