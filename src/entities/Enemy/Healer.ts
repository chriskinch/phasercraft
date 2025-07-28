import Enemy from "./Enemy";
import { maxBy } from "lodash";
import type { EnemyClassConfig } from '@/types/game';
class Healer extends Enemy {
	constructor(config: EnemyClassConfig) {
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

		if(this.getHealTarget().length > 0 && this.states.attack === "primed") this.healTarget();

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

	getHealTarget(): any {
		const targets = this.active_group.children.entries.filter((enemy: any) => {
			return (
				this.getMissingHealth(enemy) > 0 &&
				enemy !== this
			)
		});

		return (targets.length > 0) ? maxBy(targets, (enemy: any) => this.getMissingHealth(enemy)) : [];
	}

	healTarget(): void {
		this.states.attack = "casting";
		const target = this.getHealTarget();
		this.scene.time.addEvent({
			delay: 3000,
			callback: (t: any) => {
				if(t && t.state !== "dead") t.health.adjustValue(50, "magic_power", 1);
				this.states.attack = "primed";
			},
			args: [target]
		});
	}

	getMissingHealth(enemy: any): number {
		return enemy?.health.stats.max - enemy?.health.stats.value;
	}

	lastStanding(): void {
		this.aggro_radius = 400;
		this.showDebugInfo();
	}
}

export default Healer;