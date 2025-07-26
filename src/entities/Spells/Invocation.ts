import Boon from './Boon';

interface InvocationConfig {
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

interface InvocationValue {
	resource_regen_value: (baseRegenValue: number) => number;
	resource_regen_rate: number;
}

class Invocation extends Boon {
	public type: string;
	public duration: number;
	public value: InvocationValue;
	public timer: Phaser.Time.TimerEvent;

	constructor(config: InvocationConfig) {
		const defaults = {
			name: "invocation",
			icon_name: "icon_0014_haste",
			cooldown: 60,
			cost: {
				rage: 0,
				mana: 0,
				energy: 0
			},
			type: "magic",
			duration: 5,
			value: {
				resource_regen_value: (bs: number) => bs * 4, // Increase by 400%
				resource_regen_rate: -0.1 // Tick 0.1s more frequently
			}
		}

		super({ ...defaults, ...config });
		this.hasAnimation = false;
		this.type = "magic";
		this.duration = 5;
		this.value = {
			resource_regen_value: (bs: number) => bs * 4,
			resource_regen_rate: -0.1
		};
	}

	effect(): void {
		this.player.boons.addEffect(this);
		this.player.hero.setTint(0x8bc2f8);

		const timer_config = {
			delay: this.duration * 1000 + 1, // Extra ms to ensure effect is over before clearing
			callback: this.clearEffect,
			callbackScope: this
		};
		this.timer = this.scene.time.addEvent(timer_config);
		
		// Also root the player until spell is over or click to move.
		this.player.body.setMaxVelocity(0);
		this.player.root();

		this.scene.events.once('player:hit', this.clearEffect, this);
	}

	clearEffect(): void {
		this.player.idle();
		this.player.hero.clearTint();
		// Set player stats back to normal.
		this.player.body.setMaxVelocity(10000);
	}

	setAnimation(): void {}
	animationUpdate(): void {}
}

export default Invocation;