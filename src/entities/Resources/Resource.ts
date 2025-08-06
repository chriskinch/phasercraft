import { GameObjects, Scene } from "phaser";
import store from "@store";
import { setStats, setBaseStats } from "@store/gameReducer";
import pick from "lodash/pick";
import mapStateToData from "@helpers/mapStateToData";

export interface ResourceOptions {
	scene: Scene;
	x: number;
	y: number;
	container: GameObjects.Container;
	[key: string]: any;
}

interface ResourceStats {
	max: number;
	value: number;
	regen_rate: number;
	regen_value: number;
	missing?: number;
}

interface DrawBarOptions {
	type: string;
	colour: number;
	width: number;
	height: number;
	depth: number;
}

class Resource extends GameObjects.Sprite {
	public container: any;
	public name: string;
	public category: string;
	public colour: number;
	public resources: any;
	public stats: ResourceStats;
	public graphics: { [key: string]: GameObjects.Graphics };
	public tick: Phaser.Time.TimerEvent;

	constructor(config: ResourceOptions) {
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
		};
		
		if(this.container.name === "player") {
			store.dispatch(setStats(this.resources));
			store.dispatch(setBaseStats(this.resources));

			// console.log(this.selectKeys(this.category))
			this.selectKeys(this.category).forEach(key => {
				mapStateToData(
					`stats.${key}`,
					(stat: number) => this.stats[this.normaliseStat(key) as keyof ResourceStats] = stat,
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
		// Regeneration timer starts paused so that players and enemies both have it.
		this.tick = this.setRegenerationRate();
		// If regen_rate is 0 delay is 0 (very fast) but timer won't unpause.
		if(this.stats.regen_rate > 0) this.tick.paused = false;
	}

	selectKeys(prefix: string): string[] {
		return ["max", "value", "regen_value", "regen_rate"].map(key => `${prefix}_${key}`);
	}

	setValue(new_value: number): void {
		if(new_value > this.stats.max) {
			this.stats.value = this.stats.max;
		}else if(new_value < 0) {
			this.stats.value = 0;
		}else{
			this.stats.value = Math.ceil(new_value);
		}
		this.graphics.current.scaleX = this.resourcePercent();

		this.stats.missing = this.stats.max - this.stats.value;

		this.emit('change', this);
	}

	adjustValue(adj: number): void {
		this.setValue(this.stats.value + adj);
	}

	getValue(): number {
		return this.stats.value;
	}

	resourcePercent(): number {
		return (this.stats.value > 0) ? this.stats.value / this.stats.max : 0;
	}

	drawBar(opt: DrawBarOptions): GameObjects.Graphics {
		const {colour, width, height, depth} = opt;
		let graphics = this.scene.add.graphics();
			graphics.fillStyle(colour, 1);
			graphics.fillRect(0,0,width,height);
			graphics.setDepth(depth);
			graphics.x = this.x;
			graphics.y = this.y;

		return graphics;
	}

	lockGraphicsXY(): void {
		for(let graphic in this.graphics) {
			this.graphics[graphic].x = this.container.x + this.x;
			this.graphics[graphic].y = this.container.y + this.y;
		}
	}

	regenerate(): void {
		if(this.stats.regen_rate > 0 && this.stats.value < this.stats.max) {
			this.adjustValue(this.stats.regen_value);
		}
	}

	regenType(type: string): string {
		const t = (type === 'health') ? 'health' : (type === 'shield') ? 'shield' : 'resource';
		return t;
	}

	setRegen(): void {
		// Set the scale of the timer controlling regen rather than deleting and remaking
		const scale = (this.tick) ? this.tick.delay / (this.stats.regen_rate * 1000) : undefined;
		if(scale) this.tick.timeScale = scale;
	}

	normaliseStat(key: string): string {
		return key.split("_").slice(1).join("_");
	}

	setRegenerationRate(): Phaser.Time.TimerEvent {
		return this.scene.time.addEvent({
			delay: 1 + this.stats.regen_rate * 1000, 
			callback: this.doTick,
			callbackScope: this,
			loop: true,
			paused: true,
		});
	}

	doTick(): void {
		this.regenerate();
	}

	remove(): void {
		for(let graphic in this.graphics){
			this.graphics[graphic].clear();
		}
		this.destroy();
	}

}

export default Resource;