import Spell from './Spell';
import targetVector from '@helpers/targetVector';

interface MultishotConfig {
	scene: any;
	x: number;
	y: number;
	key: string;
	player: any;
	cost: { [key: string]: number };
	cooldown: number;
	name: string;
	icon_name: string;
	hotkey: string;
	slot: number;
	loop?: boolean;
	cooldownDelay?: boolean;
	cooldownDelayAll?: boolean;
}

interface EnemyWithVector {
	x: number;
	y: number;
	health: any;
	vector?: any;
}

class Multishot extends Spell {
	public type: string;
	public range: number;
	public cap: number;

	constructor(config: MultishotConfig) {
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

	effect(target?: any): void {
		// Scales value bases on player stat.
		if(target) {
			const value = this.setValue({ base: 30, key: "attack_power" });
			target.health.adjustValue(-value.amount, this.type, value.crit);
		}
	}

	startAnimation(): void {
		const enemiesInRange = (this.scene as any).enemies.children.entries
			.filter((enemy: EnemyWithVector) => {
				enemy.vector = targetVector(this.player as any, enemy as any);
				if (enemy.vector.range < this.range) return enemy;
				return null;
			})
			.sort(function (a: EnemyWithVector, b: EnemyWithVector) {
				return a.vector.range - b.vector.range;
			})
			.slice(0, this.cap);
			
		enemiesInRange.forEach((enemy: EnemyWithVector) => {
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

	updateAnimation(effect: any, target: any): void {
		effect.x = target.x;
		effect.y = target.y;
	}
}

export default Multishot;