import Resource from './Resource';

class Shield extends Resource {
	constructor(config) {
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

    toggleVisible(toggle) {
        this.setVisible(toggle);
        this.graphics.current.setVisible(toggle);
        this.graphics.background.setVisible(toggle);
    }

    onChangeHandler() {
        const has_shield = this.hasShield();
        this.toggleVisible(has_shield);
        if(!has_shield) this.emit('shield:depleted')
    }

    hasShield() {
        return this.stats.value > 0 ? true : false
    }
}

export default Shield;