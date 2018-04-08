class Resource extends Phaser.GameObjects.Sprite {

	constructor(config) {
		super(config.scene, config.x, config.y, config.key);
		config.scene.add.existing(this);

		let defaults = this.setDefaults(config.type);
		let options = Object.assign({}, defaults, config);

		this.type = options.type;
		this.offsetX = this.x;
		this.offsetY = this.y;
		this.colour = options.colour;
		this.max = options.max;
		this.value = options.value;
		this.regen_rate = options.regen_rate;
		this.regen_value = options.regen_value;

		this.setOrigin(0,0).setDepth(1000);

		this.graphics = {};
		this.graphics.current = this.drawBar({
			type: 'current',
			colour: this.colour,
			width: this.width,
			height: this.height,
			depth: 999
		});
		this.graphics.background = this.drawBar({
			type: 'background',
			colour: 0x111111,
			width: this.width,
			height: this.height,
			depth: 998
		});

		this.graphics.current.scaleX = this.healthPercent();
		this.tick = this.setRegeneration();
		this.lockGraphicsXY();
	}

	update(group){
		if(group) {
			this.x = group.x + this.offsetX;
			this.y = group.y + this.offsetY;
		}
		this.lockGraphicsXY();
	}

	setDefaults(type){
		switch(type) {
			case 'health':
				return {colour: 0x72ce6f, max: 1000, value: 1000, regen_rate: 1, regen_value: 5};
				break;
			case 'rage':
				return {colour: 0xb93f3c, max: 100, value: 0, regen_rate: 1, regen_value: 1};
				break;
			case 'mana':
				return {colour: 0x3a86ec, max: 500, value: 500, regen_rate: 0.2, regen_value: 2};
				break;
			case 'energy':
				return {colour: 0xdcd743, max: 100, value: 100, regen_rate: 3, regen_value: 20};
				break;
			default:
				return {colour: 0xeeeeee, max: 100, value: 100, regen_rate: 1, regen_value: 10};
		}
	}

	setValue(new_value) {
		if(new_value > this.max) {
			this.value = this.max;
		}else if(new_value < 0) {
			this.value = 0;
		}else{
			this.value = new_value;
		}

		this.graphics.current.scaleX = this.healthPercent();

		this.emit('change', this);
	}

	adjustValue(adj) {
		this.setValue(this.value + adj);
	}

	getValue() {
		return this.value;
	}

	healthPercent(){
		return (this.value > 0) ? this.value / this.max : 0;
	}

	drawBar(opt) {
		let graphics = this.scene.add.graphics();
			graphics.fillStyle(opt.colour, 1);
			graphics.fillRect(0,0,opt.width,opt.height);
			graphics.setDepth(opt.depth);

		return graphics;
	}

	lockGraphicsXY(){
		for(let graphic in this.graphics) {
			this.graphics[graphic].x = this.x;
			this.graphics[graphic].y = this.y;
		}
	}

	regenerate() {
		if(this.regen_rate > 0 && this.value < this.max) this.adjustValue(this.regen_value);
	}

	setRegeneration(regen_rate = this.regen_rate){
		if(this.tick) this.tick.remove(false);
		this.regen_rate = regen_rate;
		return (regen_rate > 0) ? this.scene.time.addEvent({ delay: regen_rate*1000, callback: this.doTick, callbackScope: this, loop: true }) : null;
	}

	adjustRegeneration(adj) {
		this.regen_rate += adj;
		this.setRegenRate();
	}

	doTick() {
		this.regenerate();
	}

	remove(){
		for(let graphic in this.graphics){
			this.graphics[graphic].clear();
		}
		this.destroy();
	}

}

export default Resource;