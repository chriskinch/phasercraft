import Spell from './Spell';
import targetVector from '@helpers/targetVector';
import type { SpellOptions, TargetType } from '@/types/game';
import type Enemy from '@entities/Enemy/Enemy';

class Multishot extends Spell {
	public type: string;
	public range: number;
	public cap: number;

	constructor(config: SpellOptions) {
		const defaults = {
			name: "multishot",
			icon_name: 'icon_0004_corpse-explode',
			cooldown: 0,
			cost: {
				rage: 50,
				mana: 100,
				energy: 60
			},
			type: 'physical',
			range: 360,
			cap: 3
		}

		super({ ...defaults, ...config });
		this.type = 'physical';
		this.range = 360;
		this.cap = 3;
	}
	
	setCastEvents(state: 'on' | 'off'): void {
		// Call as we click the spell i.e: instant cast.
		// Instantly triggers an off state so only do this when state is on.
		if(state === 'on') this.castSpell(this.player);
	}

	effect(target?: TargetType): void {
		// Scales value bases on player stat.
		if(target && typeof target === 'object' && 'health' in target) {
			const value = this.setValue({ base: 30, key: "attack_power" });
			target.health.adjustValue(-value.amount, this.type, value.crit);
		}
	}

	startAnimation(): void {
		const scene = this.scene as Phaser.Scene & { enemies: Phaser.GameObjects.Group };
		const enemiesInRange = scene.enemies.children.entries
			.filter((enemy): enemy is Enemy => {
				if (typeof enemy !== 'object' || !enemy) return false;
				const enemyObj = enemy as Enemy;
				enemyObj.vector = targetVector(this.player, enemyObj);
				return (enemyObj.vector?.range ?? 0) < this.range;
			})
			.sort((a, b) => {
				return (a.vector?.range ?? 0) - (b.vector?.range ?? 0);
			})
			.slice(0, this.cap);
			
		enemiesInRange.forEach((enemy) => {
			this.target = enemy;
			this.effect(enemy);

			const sprite = this.scene.add.sprite(100, 100, 'multishot-effect');
			sprite.anims.play('multishot-animation');
			const animation = sprite.setDepth(1000)
				.on('animationupdate', () => {
					this.updateAnimation(animation, enemy);
				});
		});
	}

	updateAnimation(effect: Phaser.GameObjects.Sprite, target: Enemy): void {
		effect.x = target.x;
		effect.y = target.y;
	}
}

export default Multishot;