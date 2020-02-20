import Item from "./Item";

class Fine extends Item {
	constructor() {
		super({
			base: 30,
			color: "#00dd00",
			cost: 15,
			keys: { min: 1, max: 3 },
			quality: "fine",
			quality_sort: 4,
			multiplier: 1.2
		});
	}
}

export default Fine;