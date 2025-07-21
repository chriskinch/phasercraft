import Item from "./Item";

class Rare extends Item {
	constructor() {
		super({
			base: 60,
			color: "#0077ff",
			cost: 40,
			keys: { min: 2, max: 3 },
			quality: "rare",
			quality_sort: 3,
			multiplier: 1.3
		});
	}
}

export default Rare;