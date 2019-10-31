import Item from "./Item";

class Legendary extends Item {
	constructor() {
		super({
			base: 170,
			color: "#ff9900",
			quality: "legendary",
			keys: { min: 3, max: 4 },
			multiplier: 2
		});
	}
}

export default Legendary;