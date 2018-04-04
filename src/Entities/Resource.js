class Resource extends Phaser.GameObjects.Sprite {

	constructor(config) {
		super(config.scene, config.x, config.y, config.key);
		config.scene.add.existing(this);

		// this.anchor = config.anchor;
		this.group = config.group;
		this.offsetX = this.x - this.group.x;
		this.offsetY = this.y - this.group.y;	
		this.type = config.type;
		this.max = config.max;
		this.value = config.value;
		
		this.setOrigin(0,0).setDepth(10);

		this.graphics = {};
		this.graphics.current = this.drawBar({ 
			type: 'current',
			colour: this.getColour(),
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

		this.graphics.background
	}

	update(){
		this.x = this.group.x + this.offsetX;
		this.y = this.group.y + this.offsetY;
		this.lockGraphicsXY();
		
		this.graphics.current.scaleX = this.healthPercent();
	}

	getColour(){
		switch(this.type) {
			case 'health':
				return 0x72ce6f;
				break;
			case 'rage':
				return 0xb93f3c;
				break;
			case 'mana':
				return 0x3a86ec;
				break;
			case 'energy':
				return 0xdcd743;
				break;
			default:
				return 0xeeeeee;
		}
	}

	set(new_value) {
		this.value = new_value;
	}

	get() {
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

}

export default Resource;