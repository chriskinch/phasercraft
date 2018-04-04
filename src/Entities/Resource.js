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

		this.drawBar(this.width)
		this.setOrigin(0,0)

		this.setDepth(10);
		this.graphics.setDepth(9);

		console.log(this);
	}

	update(){
		this.x = this.group.x + this.offsetX;
		this.y = this.group.y + this.offsetY;
		this.graphics.x = this.x;
		this.graphics.y = this.y;
	}

	setColour(){
		switch(this.type) {
			case 'health':
				return '0x72ce6f';
				break;
			case 'rage':
				return '0xb93f3c';
				break;
			case 'mana':
				return '0x3a86ec';
				break;
			case 'energy':
				return '0xdcd743';
				break;
			default:
				return '0xeeeeee'
		}
	}

	set(change) {
		this.value += change;
		this.graphics.scaleX = this.value / this.max;
	}

	get() {
		return this.value;
	}

	drawBar(width, height = this.height) {
		let colour = this.setColour();
		this.graphics = this.scene.add.graphics();
		this.graphics.fillStyle(colour, 1);
		this.graphics.fillRect(0,0,width-1,height-1);
	}

}

export default Resource;