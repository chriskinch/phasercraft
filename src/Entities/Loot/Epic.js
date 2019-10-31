import Item from "./Item";

class Epic extends Item {
	constructor() {
		super({
			base: 100,
			color: "#9900ff",
			quality: "epic",
			keys: { min: 2, max: 3 },
			multiplier: 1.5
		});
	}
}

export default Epic;