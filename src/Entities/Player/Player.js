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

		let resource_options = {
			group: this,
			scene: config.scene,
			key: 'resource-frame',
			x: config.x - 14
		}

		this.health = new Resource(Object.assign({}, resource_options, {type: 'health', y: config.y - 35}));
		this.add(this.health);

		this.resource = new Resource(Object.assign({}, resource_options, {type: 'rage', y: config.y - 30}));
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

	takeDamage(player, enemy){
		this.health.setValue(this.health.value - enemy.damage);
		if(this.health.getValue() <= 0) {
			this.scene.physics.pause();
			this.hero.death();
		}

		//this.resource.adjustValue(0.1);
	}

}

export default Player;