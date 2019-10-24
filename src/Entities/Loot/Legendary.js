import Item from "./Item";

class Legendary extends Item {
	constructor() {
        super({base: 180, tier: "legendary", potential: 4, multiplier: 2.1});
	}
}

export default Legendary;