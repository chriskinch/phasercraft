import Item from "./Item";

class Epic extends Item {
	constructor() {
		super({
			base: 100,
			color: "#9900ff",
			cost: 90,
			keys: { min: 2, max: 3 },
			quality: "epic",
			quality_sort: 2,
			multiplier: 1.5
		});
	}
}

export default Epic;