import Item from "./Item";

class Fine extends Item {
	constructor() {
		super({
			base: 30,
			color: "#00dd00",
			quality: "fine",
			keys: { min: 1, max: 3 },
			multiplier: 1.2
		});
	}
}

export default Fine;