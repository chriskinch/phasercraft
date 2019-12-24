import Common from "./Common";
import Fine from "./Fine";
import Rare from "./Rare";
import Epic from "./Epic";
import Legendary from "./Legendary";

class LootTable {
	constructor(quantity) {
		this.loot = Array.from({length: quantity}, () => this.qualityRoll());
	}

	qualityRoll(roll = Math.random()) {
		return (
			(roll < 0.01) ? new Legendary() :
			(roll < 0.1) ? new Epic() :
			(roll < 0.3) ? new Rare() :
			(roll < 0.6) ? new Fine() :
			new Common()
		);
	}
}

export default LootTable;