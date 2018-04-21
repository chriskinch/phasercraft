import Resource from './Resource';
import enemyConfig from '../Config/enemies.json';

class Enemy extends Phaser.GameObjects.Sprite {

	constructor(config) {
		super(config.scene, config.x, 100, config.key);
		config.scene.physics.world.enable(this);
		config.scene.add.existing(this);
		this.body.setFriction(0,0);
		this.body.setDrag(0);
		this.body.setGravityY(200);
		this.setDepth(110);

		this.type = config.key;
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

		let spawn_stop = this.scene.make.sprite({key:'blank-gif', x:this.x, y:this.y + 600}).setScale(13, 3).setInteractive();
		this.scene.physics.add.collider(spawn_stop, this);

		this.setInteractive();
		this.on('pointerdown', this.select);

		console.log(this);
	}

	update(time, delta) {
		this.health.update(this);

		if(!this.isHit) {
			this.scene.physics.moveTo(this, this.scene.player.x, this.scene.player.y, this.speed);
		}
		let walk_animation = (this.x - this.scene.player.x > 0) ? this.type + "-left-down" : this.type + "-right-up";
		this.anims.play(walk_animation, true);

		this.lockGraphicsXY();

		if(this.health.value <= 0) this.death();
	}

	drawSelected(){
		let over_size = 5;
		let graphics = this.scene.add.graphics();
			graphics.scaleY = 0.5;
			graphics.lineStyle(4, 0xb93f3c, 0.9);
			graphics.strokeCircle(0, this.height/2 + over_size, this.width/2 + over_size);
			graphics.setDepth(10);

		return graphics;
	}

	lockGraphicsXY(){
		for(let graphic in this.graphics) {
			this.graphics[graphic].x = this.x;
			this.graphics[graphic].y = this.y;
		}
	}

	select(){
		this.selected = true;
		this.graphics.selected = this.drawSelected();
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
		for(let graphic in this.health.graphics){
			this.health.graphics[graphic].clear();
		}
		this.health.destroy();
		this.destroy();
	}

	attack(){
		if(this.attack_ready) {
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