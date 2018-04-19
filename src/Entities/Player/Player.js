import Hero from './Hero';
import Resource from '../Resource';
import Weapon from '../Weapon';

class Player extends Phaser.GameObjects.Group {
	constructor(config) {
		super(config.scene, config.x, config.y);

		this.x = config.x;
		this.y = config.y;
		this.alive = true;
		this.attack_ready = true;
		this.swing_speed = config.swing_speed || this.scene.global_swing_speed;
		this.range = config.range || 40;
		this.damage = config.damage || 35;
		this.delay = 0;

		this.hero = new Hero({
			scene: this.scene,
			key: 'player',
			x: config.x,
			y: config.y,
			name: "Chris",
			primary_class: "cleric",
			secondary_class: "warrior"
		});

		let resource_options = {
			group: this,
			scene: this.scene,
			key: 'resource-frame',
			x: -14
		}

		this.health = new Resource(Object.assign({}, resource_options, {type: 'health', y: -35}));
		this.add(this.health);

		this.resource = new Resource(Object.assign({}, resource_options, {type: 'rage', y: -30}));
		this.add(this.resource);

		this.weapon = new Weapon({scene:this.scene, x:0, y:0, key:'weapon-swooch'});
		this.add(this.weapon);

		this.scene.events.once('player-dead', this.death, this);
		this.scene.events.on('enemy-attack', this.hit, this);
		this.health.on('change', this.healthChanged);
	}

	update(mouse, keys, time, delta){
		this.x = this.hero.x;
		this.y = this.hero.y;

		this.hero.update(this, mouse, keys);

		this.children.entries.forEach((entry) => {
			if(entry.shouldUpdate !== false) {
				entry.update(this);
			}
		});

		if(this.scene.selected) this.goToRange();
	}

	healthChanged(e) {
		if(e.getValue() <= 0) this.scene.events.emit('player-dead');
	}

	death(){
		this.health.remove();
		this.resource.remove();
		this.hero.anims.play('player-death');
		this.alive = false;

		this.scene.time.delayedCall(1500, () => this.scene.scene.start('GameOverScene'), [], this);
	}

	hit(damage){
		this.health.adjustValue(-damage);
	}

	goToRange(){
		let target = this.scene.selected;
		this.hero.destination = {
			x: target.x,
			y: target.y
		}
		let distance = Phaser.Math.Distance.Between(target.x,target.y, this.hero.x, this.hero.y);
		if(distance <= this.range) {
			this.hero.idle();
			this.attack_delay = null;
			if(this.attack_ready) this.attack(target);
		}else{
			if(!this.attack_delay) {
				this.attack_delay = this.scene.time.delayedCall(this.scene.global_attack_delay, this.hero.walk, [], this.hero);
			}
		}
	}

	attack(target){
		this.weapon.swoosh();
		this.positionWeapon(target);
		target.hit(this.damage);
		this.attack_ready = false;
		this.swing = this.scene.time.addEvent({ delay: this.swing_speed*1000, callback: this.attackReady, callbackScope: this, loop: true });
	}

	attackReady(){
		this.attack_ready = true;
		this.swing.remove(false);
	}

	positionWeapon(target){
		let hero_position = this.hero.body.position;
		let target_position = target.body.position;
		let angle = Math.atan2(target_position.y - hero_position.y, target_position.x - hero_position.x) * 180 / Math.PI;
		let velocity = target_position.clone().subtract(hero_position);
		target.body.setVelocity(velocity.x*2, velocity.y*2);
		this.weapon.x = target.x;
		this.weapon.y = target.y;
		this.weapon.setAngle(angle);
	}

}

export default Player;