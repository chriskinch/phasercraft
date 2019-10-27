import Item from "./Item";

class Legendary extends Item {
	constructor() {
        super({base: 180, color: "#ff9900", quality: "legendary", potential: 4, multiplier: 2.1});
	}
}

export default Legendary;