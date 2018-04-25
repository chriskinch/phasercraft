import Resource from './Resource';
import enemyConfig from '../Config/enemies.json';

class Enemy extends Phaser.GameObjects.Sprite {

	constructor(config) {
		super(config.scene, config.x, config.y - 300, config.key);
		config.scene.physics.world.enable(this);
		config.scene.add.existing(this);
		this.body.setFriction(0,0).setDrag(0).setGravityY(200).setBounce(0.2);
		this.setDepth(110);

		this.type = config.key;
		this.target = config.target;
		this.damage = config.damage || enemyConfig[this.type].damage;
		this.speed = config.speed || enemyConfig[this.type].speed;
		this.range = config.range || enemyConfig[this.type].range;
		this.swing_speed = config.swing_speed || enemyConfig[this.type].swing_speed;
		this.attack_ready = true;
		this.isHit = false;

		this.graphics = {};

		this.health = new Resource({
			group: this,
			scene: config.scene,
			key: 'resource-frame',
			x: -14,
			y: -30,
			type: 'health',
			value: config.health || enemyConfig[this.type].health,
			max: config.health || enemyConfig[this.type].health,
			regen_rate: config.regen_rate || enemyConfig[this.type].regen_rate
		});

		this.spawn_stop = this.scene.physics.add.staticImage(this.x, config.y, 'blank-gif');
		this.scene.physics.add.collider(this.spawn_stop, this);

		this.scene.physics.add.collider(this.target.hero, this, () => this.attack(), null, this);

		this.setAlpha(0);
		this.scene.tweens.add({ targets: this, alpha: 1, ease: 'Power1', duration: 500});

		this.graphics.area = this.drawGraphics('area').setInteractive();
		this.graphics.area.on('pointerdown', this.select, this);
	}

	update(time, delta) {
		if(this.spawned){
			this.health.update(this);

			if(!this.isHit) {
				this.scene.physics.moveTo(this, this.scene.player.x, this.scene.player.y, this.speed);
			}
			let walk_animation = (this.x - this.scene.player.x > 0) ? this.type + "-left-down" : this.type + "-right-up";
			this.anims.play(walk_animation, true);

			this.lockGraphicsXY();

			if(this.health.value <= 0) this.death();
		}else{
			this.spawningEnemy();
		}
	}

	// spawned(){
	// 	console.log("touching");
	// }

	enemySpawned(){
		this.body.setGravityY(0).setDrag(300);
		this.spawn_stop.destroy();
		this.spawned = true;
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

	drawGraphics(type){
		let size;
		let graphics;
		switch(type){
			case 'selected':
				size = 5;
				graphics = this.scene.add.graphics();
				graphics.scaleY = 0.5;
				graphics.lineStyle(4, 0xb93f3c, 0.9);
				graphics.strokeCircle(0, this.height/2 + size, this.width/2 + size);
				graphics.setDepth(10);	
				return graphics;	
				break;
			case 'area':
				size = 40;
				graphics = this.scene.make.graphics({x: 100, y: 100, add: false});
				graphics.fillStyle(0xff00ff, 0);
				graphics.fillCircle(size, size, size, size);
				graphics.generateTexture(type, size*2, size*2);
				let image = this.scene.add.sprite(0, 0, type);
				return image;
				break;
			default:
				return null;
		}	
	}

	lockGraphicsXY(){
		for(let graphic in this.graphics) {
			this.graphics[graphic].x = this.x;
			this.graphics[graphic].y = this.y;
		}
	}

	select(){
		this.selected = true;
		this.graphics.selected = this.drawGraphics('selected');
		this.scene.selected = this;
	}

	deselect(){
		if(this.selected) this.graphics.selected.visible = false;
		this.selected = false;
		this.scene.selected = null;
	}

	hit(damage) {
		this.isHit = true;
		this.hit_delay = this.scene.time.delayedCall(this.scene.global_attack_delay, () => this.isHit = false, [], this);
		this.health.adjustValue(-damage);
	}

	death(){
		this.deselect();
		this.graphics.area.destroy();
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

}

export default Enemy;
