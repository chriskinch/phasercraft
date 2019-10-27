import Item from "./Item";

class Epic extends Item {
	constructor() {
		super({base: 100, color: "#9900ff", quality: "epic", potential: 3, multiplier: 1.6});
	}
}

export default Epic;