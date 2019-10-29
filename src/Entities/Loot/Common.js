import Item from "./Item";

class Common extends Item {
	constructor() {
		super({base: 30, color: "#bbbbbb", quality: "common", potential: 2, multiplier: 1.1});
	}
}

export default Common;