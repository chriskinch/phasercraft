import Resource from './Resource';
import Monster from './Monster';
import enemyConfig from '../Config/enemies.json';

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

		this.type = config.key;
		this.target = config.target;
		this.damage = config.damage || enemyConfig[this.type].damage;
		this.speed = config.speed || enemyConfig[this.type].speed;
		this.range = config.range || enemyConfig[this.type].range;
		this.swing_speed = config.swing_speed || enemyConfig[this.type].swing_speed;
		this.attack_ready = true;
		this.isHit = false;
		this.hitRadius = 25;

		this.graphics = {};
		this.graphics.selected = this.drawSelected('selected');
		this.add(this.graphics.selected);

		this.health = new Resource({
			container: this,
			scene: config.scene,
			key: 'resource-frame',
			x: -14,
			y: -30,
			type: 'health',
			value: config.health || enemyConfig[this.type].health,
			max: config.health || enemyConfig[this.type].health,
			regen_rate: config.regen_rate || enemyConfig[this.type].regen_rate
		});
		this.add(this.health);

		this.spawn_stop = this.scene.physics.add.staticImage(this.x, config.y, 'blank-gif');
		this.scene.physics.add.collider(this.spawn_stop, this);

		this.setAlpha(0);
		this.scene.tweens.add({ targets: this, alpha: 1, ease: 'Power1', duration: 500});

		// Odd bug where the hit box is offset by 114px. not sure why but compensating here
		this.setInteractive(new Phaser.Geom.Circle(14, 14, this.hitRadius), Phaser.Geom.Circle.Contains);
		this.bringToTop(this.monster);

		this.on('pointerover', () => this.scene.events.paused = true);
		this.on('pointerout', () => this.scene.events.paused = false);

		if(this.scene.sys.game.config.physics.arcade.debug){
			this.showHitbox();
		}
	}

	update(time, delta) {
		this.setDepth(this.y);

		if(this.spawned){
			this.health.update(this);

			if(!this.isHit) {
				this.scene.physics.moveTo(this, this.scene.player.x, this.scene.player.y, this.speed);
			}
			let walk_animation = (this.x - this.scene.player.x > 0) ? this.type + "-left-down" : this.type + "-right-up";
			this.monster.walk(walk_animation);

			if(this.health.value <= 0) this.death();
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

		this.on('pointerdown', this.select, this);
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
		this.scene.events.emit('pointerdown:enemy', this);
		this.graphics.selected.visible = true;
		this.selected = true;
	}

	deselect(){
		if(this.selected) this.graphics.selected.visible = false;
		this.selected = false;
	}

	hit(damage) {
		this.isHit = true;
		this.hit_delay = this.scene.time.delayedCall(this.scene.global_attack_delay, () => this.isHit = false, [], this);
		this.health.adjustValue(-damage);
	}

	death(){
		this.deselect();
		this.scene.deselect();
		this.health.remove();
		this.destroy();
	}

	attack(){
		if(this.attack_ready && this.spawned) {
			this.scene.events.emit('enemy-attack', this.damage);
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
		this.hitboxDebug.strokeCircleShape(new Phaser.Geom.Circle(0, 0, 25));
		this.add(this.hitboxDebug);
	}

}

export default Enemy;
