class Resource extends Phaser.GameObjects.Sprite {

	constructor(config) {
		super(config.scene, config.x, config.y, 'resource-frame');
		config.scene.add.existing(this);

		this.container = config.container;
		this.type = this.constructor.name.toLowerCase();
		this.colour = config.colour;
		// this.max = config.max;
		// this.value = config.value;
		this.regen_rate = config.regen_rate;
		this.regen_value = config.regen_value;

		this.stats = {
			max: config.max,
			value: config.value,
			regen_rate: config.regen_rate,
			regen_value: config.regen_value
		}

		this.setOrigin(0,0).setDepth(1000);

		this.graphics = {};

		this.graphics.background = this.drawBar({
			type: 'background',
			colour: 0x111111,
			width: this.width,
			height: this.height,
			depth: 998
		});
		this.container.add(this.graphics.background);

		this.graphics.current = this.drawBar({
			type: 'current',
			colour: this.colour,
			width: this.width,
			height: this.height,
			depth: 999
		});
		this.container.add(this.graphics.current);

		this.graphics.current.scaleX = this.resourcePercent();
		this.tick = this.setRegeneration();
	}

	setValue(new_value) {
		if(new_value > this.stats.max) {
			this.stats.value = this.stats.max;
		}else if(new_value < 0) {
			this.stats.value = 0;
		}else{
			this.stats.value = new_value;
		}
		this.graphics.current.scaleX = this.resourcePercent();
		this.emit('change', this);
	}

	adjustValue(adj) {
		this.setValue(this.stats.value + adj);
	}

	getValue() {
		return this.stats.value;
	}

	resourcePercent(){
		console.log(this.stats)
		return (this.stats.value > 0) ? this.stats.value / this.stats.max : 0;
	}

	drawBar(opt) {
		let graphics = this.scene.add.graphics();
			graphics.fillStyle(opt.colour, 1);
			graphics.fillRect(0,0,opt.width,opt.height);
			graphics.setDepth(opt.depth);
			graphics.x = this.x;
			graphics.y = this.y;

		return graphics;
	}

	lockGraphicsXY(){
		for(let graphic in this.graphics) {
			this.graphics[graphic].x = this.container.x + this.x;
			this.graphics[graphic].y = this.container.y + this.y;
		}
	}

	regenerate() {
		const type = this.regenType(this.type);
		const stats = this.getRegenStats(type);
		console.log(stats)
		if(stats.regen_rate > 0 && this.stats.value < stats.max) {
			console.log("REGEN");
			this.adjustValue(stats.regen_value, this.type);
		}
	}

	regenType(type) {
		const t = (type === 'health') ? 'health' : 'resource';
		return t;
	}

	getRegenStats(type) {
		console.log(this)
		const { max, value, regen_value, regen_rate } = this.parentContainer.stats[type];
		return {
			max: (max) ? max : this.stats.max,
            value: (value) ? value : this.stats.value,
            regen_value: (regen_value) ? regen_value : this.regen_value,
            regen_rate: (regen_rate) ? regen_rate : this.regen_rate
		}
	}

	setRegeneration(regen_rate = this.regen_rate){
		if(this.tick) this.tick.remove(false);
		this.regen_rate = regen_rate;
		return (regen_rate > 0) ? this.scene.time.addEvent({ delay: regen_rate*1000, callback: this.doTick, callbackScope: this, loop: true }) : null;
	}

	adjustRegeneration(adj) {
		this.regen_rate += adj;
		this.tick = this.setRegeneration();
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