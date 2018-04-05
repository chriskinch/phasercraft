class Resource extends Phaser.GameObjects.Sprite {

	constructor(config) {
		super(config.scene, config.x, config.y, config.key);
		config.scene.add.existing(this);

		let defaults = this.setDefaults(config.type);
		for(let param in defaults){
			this[param] = defaults[param];
		};

		this.group = config.group;
		this.offsetX = this.x - this.group.x;
		this.offsetY = this.y - this.group.y;	
		this.type = config.type;

		this.max = config.max || this.max;
		this.value = config.value || this.value;
		this.regen_rate = config.regen_rate || this.regen_rate;
		this.regen_value = config.regen_value || this.regen_value;

		this.setOrigin(0,0).setDepth(10);

		this.graphics = {};
		this.graphics.current = this.drawBar({ 
			type: 'current',
			colour: this.colour,
			width: this.width,
			height: this.height,
			depth: 9
		});
		this.graphics.background = this.drawBar({ 
			type: 'background',
			colour: 0x111111,
			width: this.width,
			height: this.height,
			depth: 8
		});

		this.tick = this.setRegeneration();
	}

	update(){
		this.x = this.group.x + this.offsetX;
		this.y = this.group.y + this.offsetY;
		this.lockGraphicsXY();
		
		this.graphics.current.scaleX = this.healthPercent();
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
				return {colour: 0x3a86ec, max: 500, value: 100, regen_rate: 0.2, regen_value: 2};
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
	}

	adjustValue(adj) {
		//console.log(this.type, this.value)
		this.setValue(this.value + adj);
	}

	getValue() {
		return this.value;
	}

	healthPercent(){
		return this.value / this.max;
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

}

export default Resource;