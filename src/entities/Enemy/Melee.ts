import Enemy from "./Enemy";
import type { EnemyOptions } from '@/types/game';

class Melee extends Enemy {
	constructor(config: EnemyOptions) {
		const defaults = {
			circling_radius: 100
		}
		super({...defaults, ...config});
	}

	update(time?: number, delta?: number): void {
		super.update(time ?? 0, delta ?? 0);

		if(this.isInCirclingDistance()) {
			if(!this.circling) this.setCircling({
				from: 1,
				to: -0.5,
				delay: Math.random() * 1000,
				duration: 1000,
				repeat: Math.floor(Math.random() * 5),
				completeDelay: 2000 + Math.random() * 5000,
			});
		}
	}
}

export default Melee;