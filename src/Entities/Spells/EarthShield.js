import Spell from './Spell';

class EarthShield extends Spell {
	constructor(config) {
		const defaults = {
            name: "earthshield",
			icon_name: 'icon_0008_ki',
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
    }

	setCastEvents(state){
		// Elegible targets for this spell
		this.scene.events[state]('pointerdown:player', this.castSpell, this);
		// Event that clears the primed spell. Emitted by invalid targets.
		this.scene.events[state]('pointerdown:game', this.clearSpell, this);
		this.scene.events[state]('keypress:esc', this.clearSpell, this);
		this.scene.events[state]('pointerdown:enemy', this.clearSpell, this);
	}

    effect(target){
        console.log(target);
    }

	animationUpdate(){
        console.log(this.scene.anims.currentAnim);
		this.x = this.target.x;
		this.y = this.target.y;
	}
}

export default EarthShield;