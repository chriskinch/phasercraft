import Common from "./Common";
import Rare from "./Rare";
import Epic from "./Epic";
import Legendary from "./Legendary";

class LootTable {
	constructor() {
		this.loot = Array.from({length: 100}, () => this.tierRoll());
	}

	tierRoll(roll = Math.random()) {
		return (
			(roll < 0.01) ? new Legendary() :
			(roll < 0.1) ? new Epic() :
			(roll < 0.3) ? new Rare() :
			new Common()
		);
	}
}

export default LootTable;