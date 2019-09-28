import Spell from './Spell';
import Trap from '../Weapons/Trap';

class SnareTrap extends Spell {
	constructor(config) {
		const defaults = {
			icon_name: 'icon_0020_shackle',
			cooldown: 1,
			cost: {
				rage: 30,
				mana: 50,
				energy: 40
			},
            type: 'magic',
            duration: 5000
		}

		super({ ...defaults, ...config });
		
		// This is what the spell scales from.
        this.power = this.player.stats.magic_power;
    }
    
    animation() {
        const pointer = this.scene.input.activePointer;
        this.object = new Trap(this.scene, pointer.x, pointer.y);
        this.object.once('trap:collide', this.effect);
    }

	setTargetEvents(type){
		// Elegible targets for this spell
        this.scene.events[type]('pointerdown:game', this.focused, this);
		// Event that clears the primed spell. Emitted by invalid targets.
        this.scene.events[type]('pointerdown:enemy', this.clear, this);
		this.scene.events[type]('keypress:esc', this.clear, this);
		this.scene.events[type]('pointerdown:player', this.clear, this);
	}

	effect(target){
        if(target) {
            target.body.setMaxVelocity(0);
            target.monster.anims.pause();
            target.body.checkCollision.none = true;
            console.log(this)
            // Returns crit boolean and modified value using spell base value.
            target.health.adjustValue(-20, 'bleed', false);

            this.scene.time.delayedCall(5000, () => {
                target.body.setMaxVelocity(100);
                target.monster.anims.play();
                target.body.checkCollision.none = false;
            }, [], this);
        }
    }
}

export default SnareTrap;