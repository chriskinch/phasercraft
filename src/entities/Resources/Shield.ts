import Resource from './Resource';

interface ShieldConfig {
	scene: any;
	x: number;
	y: number;
	name?: string;
	colour?: number;
	container: any;
	health_max: number;
	shield_max?: number;
	shield_value?: number;
	shield_regen_rate?: number;
	shield_regen_value?: number;
	[key: string]: any;
}

class Shield extends Resource {
	constructor(config: ShieldConfig) {
		const defaults = {
			name: "shield",
			shield_max: config.health_max,
			shield_value: 0,
			shield_regen_rate: 0,
			shield_regen_value: 0,
			colour: 0xeeeeee
		}
		super({...defaults, ...config});

		this.toggleVisible(false);

		this.on('change', this.onChangeHandler);
	}

	toggleVisible(toggle: boolean): void {
		this.setVisible(toggle);
		this.graphics.current.setVisible(toggle);
		this.graphics.background.setVisible(toggle);
	}

	onChangeHandler(): void {
		const has_shield = this.hasShield();
		this.toggleVisible(has_shield);
		if(!has_shield) this.emit('shield:depleted')
	}

	hasShield(): boolean {
		return this.stats.value > 0 ? true : false
	}
}

export default Shield;