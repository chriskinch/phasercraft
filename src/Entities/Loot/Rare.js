import Item from "./Item";

class Rare extends Item {
	constructor() {
		super({
			base: 60,
			color: "#0077ff",
			quality: "rare",
			keys: { min: 2, max: 3 },
			multiplier: 1.3
		});
	}
}

export default Rare;