import Spell from './Spell';

class Boon extends Spell {    
    setCastEvents(state) {
        // Call as it we click on the spell to trigger effect().
		// Acts like an instant cast on the player.
        if(state === 'on') this.castSpell();
    }
}

export default Boon;
