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
		const keys = [...new Set(this.generateKeys(this.keys, stat_names))];

		const it = this.allocateStatIterator(this.stat_pool, keys.length);
		this.stats = {};
		this.info = {}
		keys.forEach((key, i) => {
			const stat = it.next(key);
			const converted = this.adjustStats(stat);
			const normalised = this.round(converted);
			this.stats[key] = normalised.rounded;
			this.info[key] = normalised;
		});
		this.category = this.getCategory();
		this.icon = this.getIcon(this.category);
		this.set = this.getSet(this.category);

		this.uuid = Math.round(Math.random() * 1000000);
		// console.log(this.quality, this, this.stat_pool)
	}

	round(stat) {
		return {...stat, rounded: stat.format === "percent" ? Math.ceil((stat.adjusted + Number.EPSILON) * 100) / 100 : Math.ceil(stat.adjusted)};
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
			attack_power: (v) => ({...stat, adjusted: v/2, format: "basic", label: "Attack Power", short: "Atk Pwr", abr: "AP"}),
			attack_speed: (v) => ({...stat, adjusted: -v/1000, format: "percent", label: "Attack Speed", short: "Atk Spd", abr: "AS"}),
			critical_chance: (v) => ({...stat, adjusted: v/10, format: "percent", label: "Critical Chance", short: "Crit", abr: "C"}),
			defence: (v) => ({...stat, adjusted: v/2, format: "basic", label: "Defence", short: "Def", abr: "D"}),
			health_max: (v) => ({...stat, adjusted: v*4, format: "basic", label: "Health Max", short: "Health", abr: "H"}),
			health_regen_rate: (v) => ({...stat, adjusted: -v/1000, format: "percent", label: "Regen Rate", short: "Reg R", abr: "RR"}),
			health_regen_value: (v) => ({...stat, adjusted: v/10, format: "basic", label: "Regen Value", short: "Reg V", abr: "RV"}),
			magic_power: (v) => ({...stat, adjusted: v/2, format: "basic", label: "Magic Power", short: "Mgc Pwr", abr: "MP"}),
			speed: (v) => ({...stat, adjusted: v/10, format: "basic", label: "Speed", short: "Spd", abr: "S"}),
			default: (v) => ({...stat, adjusted: v, format: "basic", label: "Default", short: "Default", abr: "Default"})
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