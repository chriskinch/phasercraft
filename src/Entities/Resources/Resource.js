import { GameObjects } from "phaser"
import store from "../../store"
import { setStats, setBaseStats } from "../../store/gameReducer"
import pick from "lodash/pick"
import mapStateToData from "../../Helpers/mapStateToData"

class Resource extends GameObjects.Sprite {

	constructor(config) {
		super(config.scene, config.x, config.y, 'resource-frame');
		config.scene.add.existing(this);

		this.container = config.container;
		this.name = config.name;
		this.category = this.regenType(this.name);
		this.colour = config.colour;
		
		this.resources = pick(config, this.selectKeys("resource"));

		this.stats = {
			max: config[`${this.category}_max`],
			value: config[`${this.category}_value`],
			regen_rate: config[`${this.category}_regen_rate`],
			regen_value: config[`${this.category}_regen_value`]
		}
		
		if(this.container.name === "player") {
			store.dispatch(setStats(this.resources));
			store.dispatch(setBaseStats(this.resources));

			// console.log(this.selectKeys(this.category))
			this.selectKeys(this.category).forEach(key => {
				mapStateToData(
					`stats.${key}`,
					stat => this.stats[this.normaliseStat(key)] = stat,
					{init: false}
				);
			});
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
	}

	selectKeys(prefix) {
		return ["max", "value", "regen_value", "regen_rate"].map(key => `${prefix}_${key}`);
	}

	setValue(new_value) {
		if(new_value > this.stats.max) {
			this.stats.value = this.stats.max;
		}else if(new_value < 0) {
			this.stats.value = 0;
		}else{
			this.stats.value = Math.ceil(new_value);
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
		return (this.stats.value > 0) ? this.stats.value / this.stats.max : 0;
	}

	drawBar(opt) {
		const {colour, width, height, depth} = opt;
		let graphics = this.scene.add.graphics();
			graphics.fillStyle(colour, 1);
			graphics.fillRect(0,0,width,height);
			graphics.setDepth(depth);
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
			this.adjustValue(this.stats.regen_value);
		}
	}

	regenType(type) {
		const t = (type === 'health') ? 'health' : (type === 'shield') ? 'shield' : 'resource';
		return t;
	}

	setRegen() {
		// Set the scale of the timer controlling regen rather then deleting and remaking
		const scale = (this.tick) ? this.tick.delay / (this.stats.regen_rate * 1000) : undefined;
		if(scale) this.tick.timeScale = scale;
	}

	normaliseStat(key) {
		return key.split("_").slice(1).join("_")
	}

	setRegenerationRate(){
		return this.scene.time.addEvent({
			delay: this.stats.regen_rate * 1000, 
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