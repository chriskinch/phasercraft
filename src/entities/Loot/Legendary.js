import Item from "./Item";

class Legendary extends Item {
	constructor() {
		super({
			base: 170,
			color: "#ff9900",
			cost: 200,
			keys: { min: 3, max: 4 },
			quality: "legendary",
			quality_sort: 1,
			multiplier: 2,
		});
	}
}

export default Legendary;