class Resource extends Phaser.GameObjects.Sprite {

	constructor(config) {
		super(config.scene, config.x, config.y, 'resource-frame');
		config.scene.add.existing(this);

		this.container = config.container;
		this.type = this.constructor.name.toLowerCase();
		this.colour = config.colour;

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
		// Regeneraton timer starts paused so that players and enemies both have it.
		this.tick = this.setRegenerationRate();
		// If regen_rate is 0 delay is 0 (very fast) but timer won't unpause.
		if(this.stats.regen_rate > 0) this.tick.paused = false;
		this.tick.timeScale = 2;

		this.type_category = this.regenType(this.type);
		
		this.container.on('boons:calculated', (stats) => {
			this.setRegenStats(stats[this.type_category]);
		}, this);
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
		// console.log("CATCH: ", this.stats)
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
		if(this.stats.regen_rate > 0 && this.stats.value < this.stats.max) {
			this.adjustValue(this.stats.regen_value, this.type);
		}
	}

	regenType(type) {
		const t = (type === 'health') ? 'health' : 'resource';
		return t;
	}

	setRegenStats({max = this.stats.max, regen_value = this.stats.regen_value, regen_rate = this.stats.regen_rate}) {
		this.stats.max = max;
        this.stats.regen_value = regen_value;
		this.stats.regen_rate = regen_rate;
		
		// Set the scale of the timer controlling regen rather then deleting and remaking
		const scale = this.tick.delay / (regen_rate * 1000);
		if(scale) this.tick.timeScale = scale;
	}

	setRegenerationRate(){
		return this.scene.time.addEvent({
			delay: this.stats.regen_rate*1000, 
			callback: this.doTick,
			callbackScope: this,
			loop: true,
			paused: true
		});
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