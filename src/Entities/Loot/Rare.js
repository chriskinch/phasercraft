import Item from "./Item";

class Rare extends Item {
	constructor(config) {
		super(config);
        console.log("Rare", config);
	}
}

export default Rare;