import Item from "./Item";

class Common extends Item {
	constructor(config) {
		super(config)
		console.log("Common: ", config);
	}
}

export default Common;