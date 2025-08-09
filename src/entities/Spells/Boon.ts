import Spell from './Spell';

class Boon extends Spell {
	setCastEvents(state: 'on' | 'off'): void {
		// Call as it we click on the spell to trigger effect().
		// Acts like an instant cast on the player.
		if(state === 'on') this.castSpell(this.player);
	}
}

export default Boon;