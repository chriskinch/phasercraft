import Item from "./Item";

class Rare extends Item {
	constructor() {
		super({base: 60, tier: "rare", potential: 3, multiplier: 1.3});
	}
}

export default Rare;