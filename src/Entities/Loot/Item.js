import sample from "lodash/sample"
import findKey from "lodash/findKey"
import random from "lodash/random"

class Item {
	constructor(config) {
		Object.assign(this, config);

		const stat_names = [
			"attack_power",
			"attack_speed",
			"magic_power",
			"critical_chance",
			"speed",
			"defence",
			"health_max",
			"health_regen"
		];
		
		this.stat_pool = this.generateStatPool(this.base);
		this.remaining = this.stat_pool;

		const keys = [...new Set(this.generateKeys(this.keys, stat_names))];

		this.stats = {};
		keys.forEach((key, i) => this.stats[key] = this.allocateStat(this.stat_pool, i, keys.length));

		this.category = this.getCategory();
		this.icon = this.getIcon(this.category);
		this.set = this.getSet(this.category);

		// console.log(this.quality, this.stats, this.stat_pool)
	}

	generateStatPool(base) {
		const wave = 1;
		const adjustor = wave * this.multiplier;
		return Math.round(random(base+adjustor, base*2 + adjustor) * random(1, 1.3))
	}

	generateKeys(keys, stat_names) {
		const n = random(keys.min, keys.max);
		return Array.from({length: n}, () => sample(stat_names));
	}

	allocateStat(pool, loop, length) {
		// TODO: MAKE THIS NOT A GROSS FUNCTION!
		if(length === 1) return pool; //If I only have 1 stat just assign the whole pool.
		const segment = 1/(length * 2); // E.g 2 stats = 50% mid way so range is from 25% to 75%.
		const range = {min: segment, max: segment * 3};
		const rand_range = random(range.min, range.max);
		const deduction = Math.round( pool * rand_range );
		this.remaining -= (loop+1 === length) ? 0 : deduction; // Last loop don't deduct. Otherwise you can go over budget.
		return (loop+1 === length) ? this.remaining : deduction; // Last loop just return what remains.
	}

	getIcon(category) {
		const max = {
			amulet: 3,
			armor: 30,
			axe: 40,
			bow: 6,
			gem: 10,
			helmet: 50,
			misc: 12,
			staff: 3,
			sword: 24
		};

		return `${category}_${random(1, max[category])}`;
	}

	getCategory(){
		return sample(["amulet", "armor", "axe", "bow", "gem", "helmet", "misc", "staff", "sword"]);
	}

	getSet(category){
		const sets = {
			amulet: ["amulet", "gem", "misc"],
			body: ["armor"],
			helm: ["helmet"],
			weapon: ["axe", "bow", "staff", "sword"]
		}
		return findKey(sets, (c) => c.includes(category));
	}
}

export default Item;