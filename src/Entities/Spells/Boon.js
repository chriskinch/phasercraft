import Spell from './Spell';

class Boon extends Spell {
	constructor(config) {
        super(config);
        
        console.log("BOOM")
    }
    
}

export default Boon;
