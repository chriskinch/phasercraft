import Item from "./Item";

class Common extends Item {
	constructor() {
		super({base: 30, tier: "common", potential: 2, multiplier: 1.1});
	}
}

export default Common;