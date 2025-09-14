import Spell from './Spell';
import type { SpellOptions } from '@/types/game';
import type Enemy from '@entities/Enemy/Enemy';

class SiphonSoul extends Spell {
	public type: string;
	public duration: number;
	public power: number;
	public emitter: Phaser.GameObjects.Particles.ParticleEmitter;
	public customAnimationTimer: Phaser.Time.TimerEvent;

	constructor(config: SpellOptions) {
		const defaults = {
			name: "siphonsoul",
			icon_name: 'icon_0000_death',
			cooldown: 5,
			cost: {
				rage: 60,
				mana: 100,
				energy: 60
			},
			type: 'magic',
			duration: 5,
			cooldownDelayAll: true
		}

		super({ ...defaults, ...config });
		
		// This is what the spell scales from.
		this.power = this.player.stats.magic_power / 10;
		this.type = 'magic';
		this.duration = 5;
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
		// Root the target in place.
		target.body.setMaxVelocity(0, 0);
		console.log("TARGET: ", target)
		target.monster.anims.pause();
		target.body.checkCollision.none = true;
		// Also root the player until spell is over or click to move.
		this.player.body.setMaxVelocity(0, 0);
		this.player.idle();

		this.target = target;
		this.scene.events.on('pointerdown:game', this.clearEffect, this);
	}

	clearEffect(): void {
		// Set player and target stats back to normal.
		if (this.target && typeof this.target === 'object' && 'body' in this.target && 'monster' in this.target) {
			(this.target as Enemy).body.setMaxVelocity(10000, 10000);
			(this.target as Enemy).monster.anims.resume();
			(this.target as Enemy).body.checkCollision.none = false;
		}

		this.player.body.setMaxVelocity(10000, 10000);
		this.emitter.stop();

		// We handle when to start the cooldown. Goes with cooldownDelayAll = true.
		this.customAnimationTimer.remove();
		this.cooldownTimer = this.setCooldown();
		this.scene.events.emit('spell:enableall', this);
		this.scene.events.off('pointerdown:game', this.clearEffect, this);
	}

	setParticles(): void {
		if(!this.target) return;
		const value = this.setValue({ base: 10, key: "magic_power", reducer: v => v/5});
		const target = this.target as Enemy;

		this.emitter = this.scene.add.particles(target.x, target.y, 'siphon-soul', {
			frame: new Array(5).fill(null).map((a,i)=> `health_glob_00${i}`),
			lifespan: 5000,
			speed: 15,
			frequency: 300,
			scale: 0.75,
			emitting: true
		});

		//HERE

		this.emitter.onParticleEmit(() => {
			if((this.target as Enemy).alive) {
				(this.target as Enemy).health.adjustValue(-value.amount, this.type, false);
			}
		});
	}

	startAnimation(): void {
		this.customAnimationTimer = this.scene.time.addEvent({
			delay: this.duration * 1000,
			callback: () => {
				if(!this.enabled) this.clearEffect();
			},
			callbackScope: this,
		});
		this.setParticles();
	}

	animationUpdate(): void {}
}

export default SiphonSoul;