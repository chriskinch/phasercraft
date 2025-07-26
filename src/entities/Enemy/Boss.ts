import Enemy from "./Enemy";

interface BossType {
	damage: number,
	speed: number,
	range: number,
	attack_speed: number,
	health_max: number,
	health_regen_rate: number,
	coin_multiplier: number
}

interface BossTypesConfig {
	[key: string]: BossType;
}

interface BossConfig {
	scene: any;
	x: number;
	y: number;
	key: string;
	target: any;
	types: BossTypesConfig;
	aggro_radius?: number;
	circling_radius?: number;
	active_group: any;
	set?: number;
}

class Boss extends Enemy {
	constructor(config: BossConfig) {
		const bossType = config.types[config.key];
		if (!bossType) {
			throw new Error(`Boss type "${config.key}" not found in types configuration`);
		}

		// Create the Enemy config with proper attributes
		const enemyConfig = {
			...config,
			attributes: {
				damage: bossType.damage,
				speed: bossType.speed,
				range: bossType.range,
				attack_speed: bossType.attack_speed,
				health_max: bossType.health_max,
				coin_multiplier: bossType.coin_multiplier
			},
			coin_multiplier: bossType.coin_multiplier
		};

		super(enemyConfig);
		
		this.setScale(3);
	}
}

export default Boss;