import Hero from './Hero';
import Weapon from '../Weapon';
import AssignSpell from '../Spells/AssignSpell';
import AssignResource from '../Resources/AssignResource';

class Player extends Phaser.GameObjects.Container {
	constructor({scene, x, y, ...stats}) {
		super(scene, x, y);

		this.hero = new Hero({
			scene: scene,
			key: 'player',
		});
		this.add(this.hero);

		this.setSize(this.hero.getBounds().width, this.hero.getBounds().height, true);
		scene.physics.world.enable(this);
		scene.add.existing(this);

		this.body.collideWorldBounds = true;
		this.body.immovable = true;
		this.body.setFriction(0,0);
		this.setScale(2);
				
		this.stats = stats;
		
		this.alive = true;
		this.attack_ready = true;
		this.delay = 0;
		this.destination = {
			x: null,
			y: null
		}
		const type = this.constructor.name.toLocaleLowerCase();
		this.createAnimations(type);

		this.health = new AssignResource('Health', {
			container: this,
			scene: scene,
			x: -14,
			y: -35,
			...stats.health
		});
		this.add(this.health);

		this.resource = new AssignResource(stats.resource.type, {
			container: this,
			scene: scene, x: -14,
			y: -30,
			...stats.resource
		});
		this.add(this.resource);

		this.weapon = new Weapon({scene: scene, key:'weapon-swooch'});
		this.add(this.weapon);

		scene.events.once('player:dead', this.death, this);
		scene.events.on('enemy:attack', this.hit, this);
		this.health.on('change', this.healthChanged);

		this.spells = [];
		this.spells.push(new AssignSpell('Heal', {player: this, scene: scene, x: this.x, y: this.y, key: 'spell-heal', hotkey:'ONE', slot:0}));
		this.spells.push(new AssignSpell('Fireball', {player: this, scene: scene, x: this.x, y: this.y, key: 'spell-fireball', hotkey:'TWO', slot:1}));

		this.idle();

		this.setInteractive();
		scene.events.on('pointerdown:game', this.gameDownHandler, this);
		scene.events.on('pointermove:game', this.gameMoveHandler, this);
		scene.events.on('pointerup:game', this.gameUpHandler, this);
		scene.events.on('enemy:dead', this.targetDead, this);
		this.on('pointerdown', () => scene.events.emit('pointerdown:player', this));
	}

	drawBar(opt) {
		let graphics = this.scene.add.graphics();
			graphics.fillStyle(opt.colour, 1);
			graphics.fillRect(0,0,opt.width,opt.height);
			graphics.setDepth(opt.depth);

		return graphics;
	}

	update(mouse, keys, time, delta){
		this.mouse = mouse;

		this.setDepth(this.y);

		let arrived = this.atDestination(this, this.destination);
		if(arrived && this.body.speed > 0) {
			this.idle();
		}

		if(this.scene.selected) this.goToRange();

		// Self cast key
		if(keys.space.isDown) {
			this.scene.events.emit('pointerdown:player', this);
		}

		if(keys.esc.isDown) {
			this.scene.events.emit('keypress:esc');
		}
	}

	gameDownHandler(pointer, gameObject){
		this.dragging = true;
		this.moveTo();
	}

	gameMoveHandler(){
		if(this.dragging) this.moveTo();
	}

	gameUpHandler(){
		this.dragging = false;
	}

	moveTo(target = this.mouse.pointer){
		this.destination = {
			x: target.x,
			y: target.y
		}
		this.scene.physics.moveTo(this, this.destination.x, this.destination.y, this.stats.speed);
		this.walk();
	}

	walk(){
		let walk_animation = (this.x - this.destination.x > 0) ? "player-left-down" : "player-right-up";
		this.hero.walk(walk_animation);
	}

	atDestination(obj, target, radius=10){
		if((obj.x > target.x - radius && obj.x < target.x + radius) && (obj.y > target.y - radius && obj.y < target.y + radius)){
			return true;
		}
	}

	healthChanged(e) {
		if(e.getValue() <= 0) this.scene.events.emit('player:dead');
	}

	death(){
		this.scene.events.off('pointerdown:game', this.gameDownHandler, this);
		this.scene.events.off('pointermove:game', this.gameMoveHandler, this);
		this.scene.events.off('pointerup:game', this.gameUpHandler, this);
		this.health.remove();
		this.resource.remove();
		this.hero.death();
		this.alive = false;
	}

	hit(power){
		this.scene.events.emit('player:attacked', this);
		this.health.adjustValue(-power);
	}

	idle(){
		this.body.setVelocity(0);
		this.hero.idle();
	}

	goToRange(){
		let target = this.scene.selected;
		this.moveTo(target);
		let distance = Phaser.Math.Distance.Between(target.x,target.y, this.x, this.y);
		if(distance <= this.stats.range) {
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
		const { attack_power, attack_speed } = this.stats;
		
		this.weapon.swoosh();
		this.positionWeapon(target);

		const damage = this.checkCritical(attack_power);
		target.hit(damage);

		this.attack_ready = false;
		this.swing = this.scene.time.addEvent({ delay: attack_speed*1000, callback: this.attackReady, callbackScope: this, loop: true });

		this.scene.events.emit('player:attack', this);
	}

	attackReady(){
		this.attack_ready = true;
		this.swing.remove(false);
	}

	checkCritical(value){
		const rng = Math.random() * 100; // Percentage roll up to 100.
		return (rng < this.stats.critical_chance) ? value * 1.5 : value;
	}

	positionWeapon(target){
		const player_position = this.body.position;
		const target_position = target.body.position;
		const delta_position = target_position.clone().subtract(player_position);
		const range = Math.sqrt(Math.pow(delta_position.x,2) + Math.pow(delta_position.y,2));
		// Normalised knockback values regardless of range
		const knockback = { x: delta_position.x/range, y:delta_position.y/range };
		const angle = Math.atan2(delta_position.y, delta_position.x) * 180 / Math.PI;

		target.body.setVelocity(knockback.x*this.stats.knockback, knockback.y*this.stats.knockback);
		this.weapon.setAngle(angle);
	}

	targetDead(){
		if(!this.scene.selected) this.idle();
	}

	createAnimations(type) {
		const player_animations = [
			{key: "player-idle", frames: { start: 12, end: 17 }, repeat: -1},
			{key: "player-right-up", frames: { start: 0, end: 5 }, repeat: -1},
			{key: "player-left-down", frames: { start: 6, end: 11 }, repeat: -1},
			{key: "player-death", frames: { start: 18, end: 23 }, repeat: 0}
		];
	
		player_animations.forEach(animation => {
			this.scene.anims.create({
				key: animation.key,
				frames: this.scene.anims.generateFrameNumbers(type, animation.frames),
				frameRate: 12,
				repeat: animation.repeat
			});
		});
	}
}

export default Player;