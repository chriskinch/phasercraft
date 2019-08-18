import Resource from './Resource';

class Rage extends Resource {

	constructor(config) {
		config.max = config.max || 100;
		config.value = config.value || 0;
		config.regen_rate = config.regen_rate || 1;
		config.regen_value = config.regen_value || 3;
		config.colour = config.colour || 0xb93f3c;

		super(config);
    this.scene.events.on('player:attacked', this.generate, this);
	}

  generate(player, damage){
    let amount = Math.ceil(damage/20);
    super.adjustValue(amount);
  }
}

export default Rage;