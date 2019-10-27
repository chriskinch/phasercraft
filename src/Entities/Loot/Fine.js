import Item from "./Item";

class Common extends Item {
	constructor() {
		super({base: 50, color: "#00dd00", quality: "fine", potential: 2, multiplier: 1.2});
	}
}

export default Common;