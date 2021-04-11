import Common from "./Common";
import Fine from "./Fine";
import Rare from "./Rare";
import Epic from "./Epic";
import Legendary from "./Legendary";

class LootTable {
	constructor(quantity) {

		this.loot = Array.from({length: quantity}, () => this.qualityRoll());
		// this.getLoot().then(result => {
		// 	if(result.length === 0) {
		// 		this.createLootTable(quantity).then(r => console.log("CREATE LOOT: ", r));
		// 	}else{
		// 		console.log("NEW LOOT: ", result)
		// 	}
		// });
	}

	// async getLoot() {
	// 	const loot = fetch('http://localhost:3001/dev/items')
	// 	.then(response => response.json())
	// 	.then(data => data);
	// 	return loot;
	// }

	// async createLootTable(quantity) {
	// 	const loot = Array.from({length: quantity}, () => {
	// 		fetch('http://localhost:3001/dev/items', {
	// 			method: 'POST',
	// 			headers: {
	// 				'Content-Type': 'application/json'
	// 			}
	// 		})
	// 		.then(response => response.json())
	// 		.then(data => data)
	// 	});
	// 	const resolved = await Promise.all(loot);
	// 	return resolved;
	// } 

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