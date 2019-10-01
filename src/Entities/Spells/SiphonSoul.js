import Spell from './Spell';

class SiphonSoul extends Spell {
	constructor(config) {
		const defaults = {
			icon_name: 'icon_0000_death',
			cooldown: 0,
			cost: {
				rage: 20,
				mana: 30,
				energy: 20
			},
            type: 'magic',
            duration: 6,
            lifespan: 20
		}

		super({ ...defaults, ...config });
		
		// This is what the spell scales from.
        this.power = this.player.stats.magic_power;
    }

	setCastEvents(state){
		// Elegible targets for this spell
        this.scene.events[state]('pointerdown:enemy', this.castSpell, this);
		// Event that clears the primed spell. Emitted by invalid targets.
        this.scene.events[state]('pointerdown:game', this.clearSpell, this);
		this.scene.events[state]('keypress:esc', this.clearSpell, this);
		this.scene.events[state]('pointerdown:player', this.clearSpell, this);
	}

    effect(target){
        // Root the target in place.
        target.body.setMaxVelocity(0);
        target.monster.anims.pause();
        target.body.checkCollision.none = true;
        // Scaled value but cannot crit.
        const value = this.setValue(60, this.player.stats.magic_power);
        target.health.adjustValue(-value.amount, this.type, false);
    }

    animationUpdate() {
        this.x = this.target.x;
        this.y = this.target.y;
    }
}

export default SiphonSoul;