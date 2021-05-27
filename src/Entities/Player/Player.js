import Phaser, { GameObjects } from "phaser"
import { v4 as uuid } from 'uuid';
import Hero from "./Hero"
import Weapon from "@Entities/Weapon"
import AssignSpell from "@Entities/Spells/AssignSpell"
import AssignResource from "@Entities/Resources/AssignResource"
import targetVector from "@Helpers/targetVector"
import Boons from "@Entities/UI/Boons"
import store from "@store"
import { addXP, setLevel } from "@store/gameReducer"
import mapStateToData from "@Helpers/mapStateToData"
import CombatText from "../UI/CombatText"
import { baseStatsVar, statsVar } from "@root/cache"

const converter = require('number-to-words');

class Player extends GameObjects.Container {
	constructor({scene, x, y, abilities, classification, stats, resource_type}) {
		super(scene, x, y);
		this.classification = classification;
		this.name = "player";
		this.uuid = uuid();
		const base_stats = {...stats, resource_type}; // Add resource type into to base stats.
		baseStatsVar(base_stats);
		statsVar(base_stats);
		this.stats = statsVar();

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

		this.boons = new Boons(this.scene, this);

		this.alive = true;
		this.attack_ready = true;
		this.delay = 0;
		this.destination = {
			x: null,
			y: null
		}

		this.createAnimations(classification);
		this.setExperience();

		this.health = new AssignResource('Health', {
			container: this,
			scene: scene,
			x: -14,
			y: -35,
			...stats
		});
		this.add(this.health);

		this.resource = new AssignResource(resource_type, {
			container: this,
			scene: scene,
			x: -14,
			y: -30,
			...stats
		});
		this.add(this.resource);

		this.shield = new AssignResource('Shield', {
			container: this,
			scene: scene,
			x: -14,
			y: -40,
			...stats
		});
		this.add(this.shield);

		this.weapon = new Weapon({scene: scene, key:'weapon-swooch'});
		this.add(this.weapon);

		// This maps the stats section of the store to this.stats.
		// Updates on store change using RxJS.
		// mapStateToData("stats", stats => this.stats = stats);
		mapStateToData("level.currentLevel", this.LevelUp.bind(this));

		scene.events.once('player:dead', this.death, this);
		scene.events.on('enemy:attack', this.hit, this);
		this.health.on('change', this.healthChanged);
		
		this.spells = abilities.map((spell, i) => {
			return new AssignSpell(spell, {
				player: this,
				scene: scene,
				x: this.x,
				y: this.y,
				key: `spell-${spell.toLowerCase()}`,
				hotkey:converter.toWords(i+1).toUpperCase(),
				slot:i
			});
		});

		this.idle();

		this.setInteractive();
		scene.events.on('pointerdown:game', this.gameDownHandler, this);
		scene.events.on('pointermove:game', this.gameMoveHandler, this);
		scene.events.on('pointerup:game', this.gameUpHandler, this);
		scene.events.on('enemy:dead', this.targetDead, this);
		this.on('pointerdown', () => scene.events.emit('pointerdown:player', this));

		scene.events.on('spell:primed', () => this.spellPrimed = true, this);
		scene.events.on('spell:cast', () => this.spellPrimed = false, this);
		scene.events.on('spell:cleared', () => this.spellPrimed = false, this);

		// mapStateToData("stats", s => this.stats = s);
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

	gameDownHandler(scene, pointer){
		if(!this.spellPrimed) {
			this.dragging = true;
			this.moveTo(pointer);
		}
	}

	gameMoveHandler(scene, pointer){
		if(this.dragging) this.moveTo(pointer);
	}

	gameUpHandler(){
		this.dragging = false;
	}

	moveTo(target){
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
		const damage = Math.ceil(power * (100/(100+this.stats.defence)));
		this.scene.events.emit('player:attacked', this);
		const hasShield = this.shield.hasShield();
		const pool = hasShield ? this.shield : this.health;
		if(!hasShield) this.scene.events.emit('player:hit', this);
		pool.adjustValue(-damage);
	}

	idle(){
		this.body.setVelocity(0);
		this.hero.idle();
	}

	root(){
		this.body.setVelocity(0);
		this.hero.root();
	}

	goToRange(){
		let target = this.scene.selected;
		this.moveTo(target);
		let distance = Phaser.Math.Distance.Between(target.x,target.y, this.x, this.y);
		let hit_distance = distance - target.hit_radius;

		if(hit_distance <= this.stats.range) {
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

		const crit = this.isCritical();
		const damage = crit ? attack_power * 1.5 : attack_power;
		target.hit({power: damage, crit: crit});

		this.attack_ready = false;
		this.swing = this.scene.time.addEvent({ delay: attack_speed*1000, callback: this.attackReady, callbackScope: this, loop: true });

		this.scene.events.emit('player:attack', this);
	}

	attackReady(){
		this.attack_ready = true;
		this.swing.remove(false);
	}

	isCritical(){
		const rng = Math.random() * 100; // Percentage roll up to 100.
		return (rng < this.stats.critical_chance);
	}

	positionWeapon(target){
		const vector = targetVector(this, target);
		// Normalised knockback values regardless of range
		const knockback = { x: vector.delta.x/vector.range, y:vector.delta.y/vector.range };
		const angle = Math.atan2(vector.delta.y, vector.delta.x) * 180 / Math.PI;

		target.body.setVelocity(knockback.x*this.stats.knockback, knockback.y*this.stats.knockback);
		this.weapon.setAngle(angle);
	}

	targetDead(enemy){
		store.dispatch(addXP(enemy.xp));
		this.setExperience();
		// this.add(new CombatText(this.scene, {
		// 	x: 0,
		// 	y: -30,
		// 	value: `${enemy.xp} xp`,
		// 	wander: 0,
		// 	gravity: 0
		// }))
		if(!this.scene.selected) this.idle();
	}

	setExperience(exp = store.getState().xp, count = 1) {
		const xpCurve = l => (l*l) + (l*10);
		const next = xpCurve(count);
		const remainder = exp - next;
		return (remainder < 0) ? store.dispatch(setLevel({
			xpRemaining: exp,
			toNextLevel: next,
			currentLevel: count
		})) : this.setExperience(remainder, count + 1);
	}

	LevelUp(level) {
		level > 1 &&
		this.add(new CombatText(this.scene, {
			x: 0,
			y: -30,
			type: 'level',
			value: 'LEVEL+',
			wander: 0,
			speed: 50,
			length: 2000,
			gravity: 50
		}))
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