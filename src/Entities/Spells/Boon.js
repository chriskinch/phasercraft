import Spell from './Spell';

class Boon extends Spell {
	constructor(config) {
        super(config);
    }

    setTargetEvents(type){
		// Call as it we click on the spell to trigger effect().
		// Acts like an instant cast on the player.
        this.focused(this.player);
	}
    
    animation() {}

	animationUpdate(){}
}

export default Boon;
