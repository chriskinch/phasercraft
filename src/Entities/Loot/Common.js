import Item from "./Item";

class Common extends Item {
	constructor() {
		super({
			base: 15,
			color: "#bbbbbb",
			quality: "common",
			keys: { min: 1, max: 2 },
			multiplier: 1.1
		});
	}
}

export default Common;