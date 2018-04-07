import { getSpellSchools, getAssendedClass } from '../../Config/classes';

class Hero extends Phaser.GameObjects.Sprite {

	constructor(config) {
		super(config.scene, config.x, config.y, config.key);
		config.scene.physics.world.enable(this);
		config.scene.add.existing(this);
		this.body.collideWorldBounds = true;
		this.body.immovable = true;
		this.body.setFriction(0,0);
		this.setDepth(100);

		this.group = config.group;
		this.name = config.name;
		this.type = this.setClass([config.primary_class, config.secondary_class]);
		this.spell_schools = this.setSpellSchools();
		this.assended = false;
		this.damage = config.damage;
		this.range = config.range || 40;
		this.swing_speed = config.swing_speed || this.scene.global_swing_speed;
		this.attack_ready = true;

		this.destination = {
			x: null,
			y: null
		}
		this.assendClass = this.assendClass.bind(this);

		this.idle();
	}

	update(mouse, keys) {
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

		if(keys.space.isDown) {
			console.log("SWING!");
		}
	}

	walk(){
		this.scene.physics.moveTo(this, this.destination.x, this.destination.y, 150);
		let walk_animation = (this.x - this.destination.x > 0) ? "player-left-down" : "player-right-up";
		this.anims.play(walk_animation, true);
	}

	idle(){
		this.body.setVelocity(0);
		this.anims.play('player-idle', true);
	}

	death(){
		this.anims.play('player-death');
	}

	attack(target){
		this.idle();
		if(this.attack_ready) {
			target.health.adjustValue(-this.damage);
			this.attack_ready = false;
			this.swing = this.scene.time.addEvent({ delay: this.swing_speed*1000, callback: this.attackReady, callbackScope: this, loop: true });
		}
	}

	attackReady(){
		this.attack_ready = true;
		this.swing.remove(false);
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

	atDestination(obj, target, radius=10){
		if((obj.x > target.x - radius && obj.x < target.x + radius) && (obj.y > target.y - radius && obj.y < target.y + radius)){
			return true;
		}
	}
}

export default Hero;