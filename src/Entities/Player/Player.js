import Hero from './Hero';
import Resource from '../Resource';
import Weapon from '../Weapon';
import AssignSpell from '../Spells/AssignSpell';

import { getSpellSchools, getAssendedClass } from '../../Config/classes';

class Player extends Phaser.GameObjects.Container {
	constructor(config) {
		super(config.scene, config.x, config.y);

		this.hero = new Hero({
			scene: this.scene,
			key: 'player',
		});
		this.add(this.hero);

		this.setSize(this.hero.getBounds().width, this.hero.getBounds().height, true);
		config.scene.physics.world.enable(this);
		config.scene.add.existing(this);

		this.body.immovable = true;
		this.body.setFriction(0,0);

		this.alive = true;
		this.attack_ready = true;
		this.swing_speed = config.swing_speed || this.scene.global_swing_speed;
		this.range = config.range || 40;
		this.damage = config.damage || 35;
		this.delay = 0;
		this.destination = {
			x: null,
			y: null
		}

		this.type = this.setClass([config.primary_class, config.secondary_class]);
		this.spell_schools = this.setSpellSchools();
		this.assended = false;

		this.assendClass = this.assendClass.bind(this);

		let resource_options = {
			container: this,
			scene: this.scene,
			key: 'resource-frame',
			x: -14
		}

		this.health = new Resource(Object.assign({}, resource_options, {type: 'health', y: -35}));
		this.add(this.health);

		this.resource = new Resource(Object.assign({}, resource_options, {type: 'rage', y: -30}));
		this.add(this.resource);

		this.weapon = new Weapon({scene:this.scene, key:'weapon-swooch'});
		this.add(this.weapon);

		this.scene.events.once('player-dead', this.death, this);
		this.scene.events.on('enemy-attack', this.hit, this);
		this.health.on('change', this.healthChanged);

		this.spell = new AssignSpell('Heal', {scene: this.scene, x: this.x, y: this.y, key: 'spell-heal'});

		this.idle();
	}

	drawBar(opt) {
		let graphics = this.scene.add.graphics();
			graphics.fillStyle(opt.colour, 1);
			graphics.fillRect(0,0,opt.width,opt.height);
			graphics.setDepth(opt.depth);

		return graphics;
	}

	assignSpell(name, opts){
		return new name(opts);
	}

	update(mouse, keys, time, delta){
		let arrived = this.atDestination(this, this.destination);

		if(arrived && this.body.speed > 0) {
			this.idle();
		}

		if(mouse.left.isDown) {
			this.destination = {
				x: mouse.pointer.x,
				y: mouse.pointer.y
			}
			this.walk();
		}

		if(this.scene.selected) this.goToRange();

		if(keys.space.isDown) {
			this.scene.events.emit('heal', this);
		}
	}

	walk(){
		this.scene.physics.moveTo(this, this.destination.x, this.destination.y, 150);
		let walk_animation = (this.x - this.destination.x > 0) ? "player-left-down" : "player-right-up";
		this.hero.walk(walk_animation);
	}

	atDestination(obj, target, radius=10){
		if((obj.x > target.x - radius && obj.x < target.x + radius) && (obj.y > target.y - radius && obj.y < target.y + radius)){
			return true;
		}
	}

	healthChanged(e) {
		if(e.getValue() <= 0) this.scene.events.emit('player-dead');
	}

	death(){
		this.health.remove();
		this.resource.remove();
		this.hero.death();
		this.alive = false;
	}

	hit(damage){
		this.health.adjustValue(-damage);
	}

	idle(){
		this.body.setVelocity(0);
		this.hero.idle();
	}

	goToRange(){
		let target = this.scene.selected;
		this.destination = {
			x: target.x,
			y: target.y
		}
		let distance = Phaser.Math.Distance.Between(target.x,target.y, this.x, this.y);
		if(distance <= this.range) {
			this.idle();
			this.attack_delay = null;
			if(this.attack_ready) this.attack(target);
		}else{
			if(!this.attack_delay) {
				this.attack_delay = this.scene.time.delayedCall(this.scene.global_attack_delay, this.walk, [], this);
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
		let player_position = this.body.position;
		let target_position = target.body.position;
		let angle = Math.atan2(target_position.y - player_position.y, target_position.x - player_position.x) * 180 / Math.PI;
		let velocity = target_position.clone().subtract(player_position);
		target.body.setVelocity(velocity.x*2, velocity.y*2);
		this.weapon.setAngle(angle);
	}

	setClass(types){
		return (types[1]) ? getAssendedClass(types) : types[0];
	}

	setSpellSchools(){
		return getSpellSchools(this.type);
	}

	assendClass(type){
		if(!this.assended) {
			this.type = this.setClass([this.type, type]);
			this.spell_schools = this.setSpellSchools();
			this.assended = true;
		}
	}

}

export default Player;