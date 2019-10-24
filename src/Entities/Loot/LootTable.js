import Common from "./Common";
import Rare from "./Rare";

class LootTable {
	constructor(config) {
		const loot = new Common();
		console.log(loot);
		console.log("Table: ", config);
	}
}

export default LootTable;