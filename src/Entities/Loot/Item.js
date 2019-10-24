class Item {
	constructor(config) {
		this.stats = {
			ap: 100,
			mp: 50
		}
		console.log("Item: ", config);
	}

	generate(){
		return this;
	}
}

export default Item;