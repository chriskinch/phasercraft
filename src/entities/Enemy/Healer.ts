import Enemy from "./Enemy";
import { maxBy } from "lodash";
import type { EnemyOptions } from '@/types/game';
class Healer extends Enemy {
	constructor(config: EnemyOptions) {
		const defaults = {
			circling_radius: 70,
			aggro_radius: 40
		}
		super({...defaults, ...config});

		this.once('enemy:last', this.lastStanding, this);
	}

	update(time?: number, delta?: number): void {
		super.update(time ?? 0, delta ?? 0);

		if(this.active_group.children.entries.length === 1) this.emit('enemy:last', this);

		if(this.getHealTarget() && this.states.attack === "primed") this.healTarget();

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

	getHealTarget(): Enemy | undefined {
		const targets = this.active_group.children.entries.filter(enemy => {
			return (
				this.getMissingHealth(enemy as Enemy) > 0 &&
				enemy !== this
			)
		});
		return (targets.length > 0) ? maxBy(targets as Enemy[], (enemy: Enemy) => this.getMissingHealth(enemy)) : undefined
	}

	healTarget(): void {
		this.states.attack = "casting";
		const target = this.getHealTarget();
		this.scene.time.addEvent({
			delay: 3000,
			callback: (t: Enemy) => {
				if(t && t.state !== "dead") t.health.adjustValue(50, "magic_power", false);
				this.states.attack = "primed";
			},
			args: [target]
		});
	}

	getMissingHealth(enemy: Enemy): number {
		return enemy?.health.stats.max - enemy?.health.stats.value;
	}

	lastStanding(): void {
		this.aggro_radius = 400;
		this.showDebugInfo();
	}
}

export default Healer;