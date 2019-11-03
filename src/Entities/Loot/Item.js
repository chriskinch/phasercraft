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
			"health_regen_rate",
			"health_regen_value"
		];
		
		this.stat_pool = this.generateStatPool(this.base);
		this.remaining = this.stat_pool;

		const keys = [...new Set(this.generateKeys(this.keys, stat_names))];

		const it = this.allocateStatIterator(this.stat_pool, keys.length);
		this.stats = {};
		this.info = {}
		keys.forEach((key, i) => {
			const stat = it.next(key);
			const converted = this.adjustStats(stat);
			// console.log(converted);
			this.stats[key] = converted.adjusted;
			this.info[key] = converted;
		});
		this.category = this.getCategory();
		this.icon = this.getIcon(this.category);
		this.set = this.getSet(this.category);

		// console.log(this.quality, this, this.stat_pool)
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

	allocateStatIterator(pool, length) {
		let count = 0;
		const statIterator = {
		   	next: (key) => {
				const range = 1/(length * 2); // E.g 2 stats = 50% mid way so range is from 25% to 75%.
				const deduction = Math.round( pool * random(range, range * 3)); // Percentage of lower to upper range.
				if (count < length-1) {
					pool -= deduction;
					count++;
					return { value: deduction, done: false, key };
			   	}
			   	return { value: pool, done: true, key };
		   	}
		};
		return statIterator;
	}

	adjustStats(stat) {
		const funcs = {
			attack_power: (v) => ({...stat, adjusted: v/2, format: "basic"}),
			attack_speed: (v) => ({...stat, adjusted: -v/1000, format: "percent"}),
			critical_chance: (v) => ({...stat, adjusted: v/1000, format: "percent"}),
			defence: (v) => ({...stat, adjusted: v/2, format: "basic"}),
			health_max: (v) => ({...stat, adjusted: v, format: "basic"}),
			health_regen_rate: (v) => ({...stat, adjusted: -v/1000, format: "percent"}),
			health_regen_value: (v) => ({...stat, adjusted: v/20, format: "basic"}),
			magic_power: (v) => ({...stat, adjusted: v/2, format: "basic"}),
			speed: (v) => ({...stat, adjusted: v/10, format: "basic"}),
			default: (v) => ({...stat, adjusted: v, format: "basic"})
		};

		return funcs.hasOwnProperty(stat.key) ? 
			funcs[stat.key](stat.value) :
			funcs.default(stat.value);
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