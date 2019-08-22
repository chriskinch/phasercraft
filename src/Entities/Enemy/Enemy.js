import AssignResource from '../Resources/AssignResource';
import Monster from './Monster';
import enemyConfig from '../../Config/enemies.json';
import Coin from '../Loot/Coin';

class Enemy extends Phaser.GameObjects.Container {

	constructor(config) {
		super(config.scene, config.x, config.y - 300);

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
		this.damage = config.damage || enemyConfig[this.key].damage;
		this.speed = config.speed || enemyConfig[this.key].speed;
		this.range = config.range || enemyConfig[this.key].range;
		this.swing_speed = config.swing_speed || enemyConfig[this.key].swing_speed;
		this.attack_ready = true;
		this.isHit = false;
		this.hitRadius = 25;
		this.loot_chance = 0.75;

		this.graphics = {};
		this.graphics.selected = this.drawSelected('selected');
		this.add(this.graphics.selected);

		this.health = new AssignResource('Health', {
			container: this,
			scene: config.scene,
			x: -14,
			y: -30,
			value: config.health || enemyConfig[this.key].health,
			max: config.health || enemyConfig[this.key].health,
			regen_rate: config.regen_rate || enemyConfig[this.key].regen_rate
		});
		this.add(this.health);

		this.spawn_stop = this.scene.physics.add.staticImage(this.x, config.y, 'blank-gif');
		this.scene.physics.add.collider(this.spawn_stop, this);

		this.setAlpha(0).setScale(2);
		this.scene.tweens.add({ targets: this, alpha: 1, ease: 'Power1', duration: 500});

		// Odd bug where the hit box is offset by 114px. not sure why but compensating here
		this.setInteractive(new Phaser.Geom.Circle(14, 14, this.hitRadius), Phaser.Geom.Circle.Contains);
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
				this.scene.physics.moveTo(this, this.scene.player.x, this.scene.player.y, this.speed);
			}
			let walk_animation = (this.x - this.scene.player.x > 0) ? this.key + "-left-down" : this.key + "-right-up";
			this.monster.walk(walk_animation);

			if(this.health.value <= 0) this.emit('enemy:dead', this);
		}else{
			this.spawningEnemy();
		}
	}

	enemySpawned(){
		this.body.setGravityY(0).setDrag(300);
		this.spawn_stop.destroy();
		this.spawned = true;

		this.scene.physics.add.collider(this.target.hero, this, () => this.attack(), null, this);
		this.scene.physics.add.collider(this.scene.enemies, this.scene.enemies);

		this.on('pointerdown', () => {
			let spell = this.scene.spell;
			this.scene.events.emit('pointerdown:enemy', this);
			if(!spell || (spell && !this.scene.selected)){
				this.select();
			}
		});

		this.scene.events.on('spell:primed', this.primed, this);
		this.scene.events.on('spell:cast', this.cast, this);
	}

	spawningEnemy(){
		if(this.body.touching.down) {
			if(!this.spawning) this.spawning = this.scene.time.delayedCall(100, this.enemySpawned, [], this);
		}else{
			if(this.spawning) {
				this.spawning.remove(false);
				delete this.spawning;
			}
		}
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

	primed(){
		this.scene.events.off('pointerdown:enemy', this.deselect, this);
	}

	cast() {
		this.scene.events.on('pointerdown:enemy', this.deselect, this);
	}

	hit(damage){
		this.isHit = true;
		this.hit_delay = this.scene.time.delayedCall(this.scene.global_attack_delay, () => this.isHit = false, [], this);
		this.health.adjustValue(-damage);
	}

	death(){
		this.deselect();
		this.health.remove();
		this.scene.events.off('pointerdown:enemy', this.deselect, this);
		this.scene.events.off('pointerdown:game', this.deselect, this);
		this.scene.events.off('spell:primed', this.primed, this);
		this.scene.events.off('spell:cast', this.cast, this);
		this.scene.events.emit('enemy:dead', this);
		this.monster.death();
		this.active = false;
		this.input.enabled = false;
		this.scene.physics.world.disable(this);
		this.scene.enemies.remove(this);
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
		let roll = Math.random();
		if(roll < this.loot_chance) {
			new Coin({scene:this.scene, x:this.x, y:this.y});
		}
	}

	attack(){
		if(this.attack_ready && this.spawned) {
			this.scene.events.emit('enemy:attack', this.damage);
			this.attack_ready = false;
			this.swing = this.scene.time.addEvent({ delay: this.swing_speed*1000, callback: this.attackReady, callbackScope: this, loop: true });
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
		this.hitboxDebug.strokeCircleShape(new Phaser.Geom.Circle(0, 0, this.hitRadius));
		this.add(this.hitboxDebug);
	}

}

export default Enemy;