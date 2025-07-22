import Item from "./Item";

class Common extends Item {
	constructor() {
		super({
			base: 15,
			color: "#bbbbbb",
			cost: 5,
			keys: { min: 1, max: 2 },
			quality: "common",
			quality_sort: 5,
			multiplier: 1.1
		});
	}
}

export default Common;