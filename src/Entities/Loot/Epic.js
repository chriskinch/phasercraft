import Item from "./Item";

class Epic extends Item {
	constructor() {
		super({base: 100, tier: "epic", potential: 3, multiplier: 1.6});
	}
}

export default Epic;