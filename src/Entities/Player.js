import Hero from './Hero';
import Resource from './Resource';

class Player extends Phaser.GameObjects.Group {
	constructor(config) {
		super(config.scene, config.x, config.y);

		this.x = config.x;
		this.y = config.y;

		this.destination = {
			x: null,
			y: null
		}

		this.hero = new Hero({
			scene: config.scene,
			key: 'player',
			x: config.x, 
			y: config.y,
			name: "Chris",
			primary_class: "cleric",
			secondary_class: "warrior"
		});

		this.health = new Resource({
			group: this,
			scene: config.scene,
			key: 'resource-frame',
			x: config.x - 14, 
			y: config.y - 30,
			type: 'health',
			max: 500,
			value: 500
		});
		this.add(this.health);

		this.resource = new Resource({
			group: this,
			scene: config.scene,
			key: 'resource-frame',
			x: config.x - 14, 
			y: config.y - 25,
			type: 'rage',
			max: 100,
			value: 100
		});
		this.add(this.resource);
	}

	update(mouse, keys, time, delta){
		this.x = this.hero.x;
		this.y = this.hero.y;

		this.hero.update(mouse, keys);

		this.children.entries.forEach((entry) => {
			entry.update();
		})
	}

	setResource(type, value) {
		this[type].set(value);
	}

	getResource(type) {
		console.log(type)
		return this[type].get();
	}

}

export default Player;