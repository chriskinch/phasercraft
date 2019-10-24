class Item {
	constructor({ tier }) {
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
		const n = (tier === "legendary") ? 4 : (tier === "epic") ? 3 : (tier === "rare") ? 3 : 2; 
		const keys = Array.from({length: n}, () => this.getRandomKey(stat_names));
		this.stats = keys.forEach(key => stat_names[key] = this.generateStat(20));

		console.log(this.stats)
	}

	getRandomKey(arr) {
		return arr[Math.floor(Math.random() * arr.length)];
	}

	generateStat(base) {
		const wave = 30;
		const rand = Math.round( Math.random() * wave + wave );
		return (base + wave + rand) * this.multiplier;
	}
}

export default Item;