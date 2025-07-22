import Spell from './Spell';
import Trap from '../Weapons/Trap';

class SnareTrap extends Spell {
	constructor(config) {
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
    }

    // Override and remove the defaul spell animation functions.
    setAnimation(){}
    startAnimation() {}

	setCastEvents(state){
		// Elegible targets for this spell
        this.scene.events[state]('pointerdown:game', this.castSpell, this);
		// Event that clears the primed spell. Emitted by invalid targets.
        this.scene.events[state]('pointerdown:enemy', this.clearSpell, this);
		this.scene.events[state]('keypress:esc', this.clearSpell, this);
		this.scene.events[state]('pointerdown:player', this.clearSpell, this);
	}

    triggerTrap(target) {
        target.body.setMaxVelocity(0);
        target.monster.anims.pause();
        target.body.checkCollision.none = true;
        // Using a flat value and false so trap annot crit. TODO: Bleed over time.
        target.health.adjustValue(-20, this.type, false);
        
        this.scene.time.delayedCall(this.duration * 1000, () => {
            target.body.setMaxVelocity(10000);
            target.monster.anims.resume();
            target.body.checkCollision.none = false;
        }, [], this);
    }
    
    layTrap() {
        const pointer = this.scene.input.activePointer;
        this.item = new Trap(this.scene, pointer.x, pointer.y, this.lifespan);
        this.item.once('trap:collide', this.effect, this);
    }

    effect(target){
        // Only trigger if the target have a body.
        // Game scene does not so lay the trap rather then trigger the trap.
        (target.body) ? this.triggerTrap(target) : this.layTrap();
        this.clearSpell();
    }
}

export default SnareTrap;