import Enemy from "./Enemy";

interface RangedConfig {
	scene: any;
	x: number;
	y: number;
	key: string;
	target: any;
	attributes: any;
	aggro_radius?: number;
	circling_radius?: number;
	coin_multiplier: number;
	active_group: any;
	set?: number;
}

class Ranged extends Enemy {
	constructor(config: RangedConfig) {
		const defaults = {
			circling_radius: 170,
		}
		super({...defaults, ...config});
	}

	update(time?: number, delta?: number): void {
		super.update(time ?? 0, delta ?? 0);

		if(this.isInCirclingDistance()) {
			if(!this.circling) this.setCircling({
				from: 0,
				to: -1,
				delay: Math.random() * 2000,
				duration: 1200,
				repeat: -1,
				completeDelay: 2000 + Math.random() * 2000,
			});
		}
	}
}

export default Ranged;