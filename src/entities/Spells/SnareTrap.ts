import Spell from './Spell';
import Trap from '../Weapons/Trap';
import type { SpellOptions } from '@/types/game';

class SnareTrap extends Spell {
	public type: string;
	public duration: number;
	public lifespan: number;
	public item: Trap;

	constructor(config: SpellOptions) {
		const defaults = {
			name: "snaretrap",
			icon_name: 'icon_0020_shackle',
			cooldown: 0,
			cost: {
				rage: 20,
				mana: 30,
				energy: 20
			},
			type: 'bleed',
			duration: 6,
			lifespan: 20
		}

		super({ ...defaults, ...config });
		this.type = 'bleed';
		this.duration = 6;
		this.lifespan = 20;
	}

	// Override and remove the default spell animation functions.
	setAnimation(): void {}
	startAnimation(): void {}

	setCastEvents(state: 'on' | 'off'): void {
		// Elegible targets for this spell
		this.scene.events[state]('pointerdown:game', this.castSpell, this);
		// Event that clears the primed spell. Emitted by invalid targets.
		this.scene.events[state]('pointerdown:enemy', this.clearSpell, this);
		this.scene.events[state]('keypress:esc', this.clearSpell, this);
		this.scene.events[state]('pointerdown:player', this.clearSpell, this);
	}

	triggerTrap(target: any): void {
		target.body.setMaxVelocity(0);
		target.monster.anims.pause();
		target.body.checkCollision.none = true;
		// Using a flat value and false so trap cannot crit. TODO: Bleed over time.
		target.health.adjustValue(-20, this.type, false);
		
		this.scene.time.delayedCall(this.duration * 1000, () => {
			target.body.setMaxVelocity(10000);
			target.monster.anims.resume();
			target.body.checkCollision.none = false;
		}, [], this);
	}
	
	layTrap(): void {
		const pointer = this.scene.input.activePointer;
		this.item = new Trap(this.scene, pointer.x, pointer.y, this.lifespan);
		this.item.once('trap:collide', this.effect, this);
	}

	effect(target: any): void {
		// Only trigger if the target have a body.
		// Game scene does not so lay the trap rather then trigger the trap.
		(target.body) ? this.triggerTrap(target) : this.layTrap();
		this.clearSpell();
	}
}

export default SnareTrap;