import { GameObjects, Geom } from "phaser"
import { v4 as uuid } from 'uuid';
import AssignResource from "@Entities/Resources/AssignResource"
import Monster from "./Monster"
import Coin from "@Entities/Loot/Coin"
import Gem from "@Entities/Loot/Gem"
import Banes from "@Entities/UI/Banes"

class Enemy extends GameObjects.Container {

	constructor(config) {
		super(config.scene, config.x, config.y - 300);

		this.uuid = uuid();

		this.monster = new Monster({
			scene: this.scene,
			key: config.key,
			x: Math.random() * 800,
			y: Math.random() * 600,
			target: config.target
		});
		this.add(this.monster);

		this.setSize(this.monster.getBounds().width, this.monster.getBounds().height, true);
		config.scene.physics.world.enable(this);
		config.scene.add.existing(this);
		this.body.setFriction(0,0).setDrag(0).setGravityY(200).setBounce(0.2);

		this.key = config.key;
		this.target = config.target;
		this.attack_ready = true;
		this.isHit = false;
		this.hit_radius = config.hit_radius || 25;
		this.loot_chance = 0.75;
		this.loot_multiplier = config.loot_multiplier;
		this.active_group = config.active_group;
		this.alive = true;

		this.set = config.set || 0;

		this.base_stats = this.setStats(config.types[this.key], this.set);
		this.stats = { ...this.base_stats };
		this.stats.health_value = this.stats.health_max;

		this.xp = this.stats.health_value / 10;

		this.graphics = {};
		this.graphics.selected = this.drawSelected('selected');
		this.add(this.graphics.selected);

		this.health = new AssignResource('Health', {
			container: this,
			scene: config.scene,
			x: -14,
			y: -30,
			...this.stats
		});
		this.add(this.health);

		this.banes = new Banes(this.scene, this);

		this.spawn_stop = this.scene.physics.add.staticImage(this.x, config.y, 'blank-gif');
		this.scene.physics.add.collider(this.spawn_stop, this);

		this.setAlpha(0);
		this.scene.tweens.add({ targets: this, alpha: 1, ease: 'Power1', duration: 500});

		// Odd bug where the hit box is offset by 114px. not sure why but compensating here
		this.setInteractive(new Geom.Circle(14, 14, this.hit_radius), Geom.Circle.Contains);
		this.bringToTop(this.monster);

		if(this.scene.sys.game.config.physics.arcade.debug){
			this.showHitbox();
		}

		this.scene.events.on('pointerdown:game', this.deselect, this);
		this.scene.events.on('pointerdown:enemy', this.deselect, this);
		this.once('enemy:dead', this.death, this);
	}

	update(time, delta) {
		this.setDepth(this.y);

		if(this.spawned){
			this.health.update(this);

			if(!this.isHit) {
				this.scene.physics.moveTo(this, this.scene.player.x, this.scene.player.y, this.stats.speed);
			}

			if(this.health.getValue() <= 0) this.emit('enemy:dead', this);
		}else{
			this.spawningEnemy();
		}
	}

	setStats(stats, set){
		// Stats get adjusted indivdually as wave go on.
		const new_stats = {};
		new_stats.damage = Math.round(stats.damage * (set/5 + 1));
		new_stats.health_max = stats.health_max * (set + 1);
		new_stats.attack_speed = stats.attack_speed - (set/50);
		new_stats.loot_multiplier = stats.loot_multiplier * (set/5 + 1);
		
		return {...stats, ...new_stats};
	}

	enemySpawned(){
		this.body.setGravityY(0).setDrag(300);
		this.spawn_stop.destroy();
		this.spawned = true;

		this.active_group.add(this);

		this.scene.physics.add.collider(this.target.hero, this, () => this.attack(), null, this);
		this.collider = this.scene.physics.add.collider(this.scene.active_enemies, this.scene.active_enemies);

		this.on('pointerdown', () => {
			this.scene.events.emit('pointerdown:enemy', this);
			this.select();
		});

		const walk_animation = (this.x - this.scene.player.x > 0) ? this.key + "-left-down" : this.key + "-right-up";
		this.monster.walk(walk_animation);
	}

	spawningEnemy(){
		if(this.body.touching.down && this.body.wasTouching.down) this.enemySpawned();
	}

	drawSelected(){
		let size = 5;
		let graphics = this.scene.add.graphics();
				graphics.scaleY = 0.5;
				graphics.lineStyle(4, 0xb93f3c, 0.9);
				graphics.strokeCircle(0, this.height/2 + size, this.width/2 + size);
				graphics.setDepth(10);
				graphics.visible = false;
		return graphics;
	}

	select(){
		this.graphics.selected.visible = true;
		this.selected = true;
		this.scene.selected = this;
	}

	deselect(){
		if(this.selected){
			this.graphics.selected.visible = false;
			this.selected = false;
			this.scene.selected = null;
		}
	}

	hit({power, type = 'physical', crit}){
		this.isHit = true;
		this.hit_delay = this.scene.time.delayedCall(this.scene.global_attack_delay, () => this.isHit = false, [], this);
		this.health.adjustValue(-power, type, crit);
	}

	death(){
		this.deselect();
		this.health.remove();
		this.scene.events.off('pointerdown:enemy', this.deselect, this);
		this.scene.events.off('pointerdown:game', this.deselect, this);
		this.scene.events.emit('enemy:dead', this);
		this.monster.death();
		this.alive = false;
		this.active = false;
		this.input.enabled = false;
		this.scene.physics.world.disable(this);
		this.scene.enemies.remove(this);
		this.scene.active_enemies.remove(this);
		this.decompose();
		this.dropLoot();
	}

	decompose(){
		this.scene.tweens.add({
			targets: this,
			alpha: 0,
			ease: 'Power1',
			duration: 10000,
			onComplete: this.cleanup.bind(this)
		});
	}

	cleanup(){
		this.destroy();
	}

	dropLoot(){
		const drop_amount = Math.ceil(Math.random() * this.stats.loot_multiplier);
		for(let i = 0; i < drop_amount; i++){
			const drop_type = Math.random();
			if(drop_type < this.loot_chance) {
				new Coin({scene:this.scene, x:this.x, y:this.y});
			}else{
				new Gem({scene:this.scene, x:this.x, y:this.y});
			}
		}
	}

	attack(){
		if(this.attack_ready && this.spawned) {
			this.scene.events.emit('enemy:attack', this.stats.damage);
			this.attack_ready = false;
			this.swing = this.scene.time.addEvent({ 
				delay: this.stats.attack_speed*1000,
				callback: this.attackReady,
				callbackScope: this,
				loop: true
			});
		}
	}

	attackReady(){
		this.attack_ready = true;
		this.swing.remove(false);
	}

	showHitbox(){
		//Just to display the hit area, not actually needed to work. Also doesn't have the same bug about being offset.
		this.hitboxDebug = this.scene.add.graphics();
		this.hitboxDebug.lineStyle(1, 0x00ffff, 1);
		this.hitboxDebug.strokeCircleShape(new Geom.Circle(0, 0, this.hit_radius));
		this.add(this.hitboxDebug);
	}

}

export default Enemy;
