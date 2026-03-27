import Spell from './Spell';
import targetVector from '@helpers/targetVector';
import type { SpellOptions, EnemyOptions, TargetType } from '@/types/game';
import type Enemy from '@entities/Enemy/Enemy';

class Whirlwind extends Spell {
	public type: string;
	public range: number;
	public cap: number;

	constructor(config: SpellOptions) {
		const defaults = {
			name: "whirlwind",
			icon_name: 'icon_0005_coil',
			cooldown: 2,
			cost: {
				rage: 50,
				mana: 80,
				energy: 60
			},
			type: 'physical',
			range: 120,
			cap: 5
		}

		super({ ...defaults, ...config });
		
		this.setScale(2);
		this.type = 'physical';
		this.range = 120;
		this.cap = 5;
	}

	setCastEvents(state: 'on' | 'off'): void {
		// Call as it we click the spell to trigger effect().
		// Acts like an instant cast.
		if(state === 'on') this.castSpell(this.player);
	}

	effect(target: TargetType): void {
		const scene = this.scene as Phaser.Scene & { enemies: Phaser.GameObjects.Group };
		const enemiesInRange = scene.enemies.children.entries
			.filter((enemy): enemy is Enemy => {
				if (typeof enemy !== 'object' || !enemy) return false;
				const enemyObj = enemy as Enemy;
				enemyObj.vector = targetVector(this.player, enemyObj);
				return enemyObj.vector?.range !== undefined && enemyObj.vector.range < this.range;
			})
			.sort((a, b) => {
				return (a.vector?.range ?? 0) - (b.vector?.range ?? 0);
			});

		// Modified if more the cap. This ensure that the spell is not massively overpowered.
		// TODO: Abstract this capping functionality out as many spells might use.
		const mod = this.powerCap(enemiesInRange);
		// Scales value bases on player stat.
		const value = this.setValue({ base: 30, key: "attack_power" });

		enemiesInRange.forEach((enemy) => {
			if (enemy && enemy.health) {
				enemy.health.adjustValue(-value.amount * mod, this.type, value.crit);
			}
		});
	}

	powerCap(enemies: Enemy[]): number {
		const split = (enemies.length < this.cap) ? this.cap : enemies.length;
		const spread = this.cap / split;
		return spread;
	}

	animationUpdate(): void {
		this.x = this.player.x;
		this.y = this.player.y;
	}
}

export default Whirlwind;