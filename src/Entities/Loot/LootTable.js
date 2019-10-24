import Common from "./Common";
import Rare from "./Rare";
import Epic from "./Epic";
import Legendary from "./Legendary";

class LootTable {
	constructor() {
		this.loot = Array.from({length: 100}, () => this.tierRoll());
		console.log("Table: ", this.loot);
	}

	tierRoll(roll = Math.random()) {
		return (
			(roll < 0.01) ? new Legendary() :
			(roll < 0.1) ? new Epic() :
			(roll < 0.4) ? new Rare() :
			new Common()
		);
	}
}

export default LootTable;