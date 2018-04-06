import PlayerSprite from '../Graphics/player.png';
import EnemySprite from '../Graphics/enemy.png';
import ResourceFrame from '../Graphics/resource-frame.png';

import Player from '../Entities/Player/Player';
import Enemy from '../Entities/Enemy';

class GameScene extends Phaser.Scene {
		constructor() {
			super({
				key: 'GameScene'
			});

			this.global_tick = 0.2;
			this.global_swing_speed = 1;
		}

		preload (){
			this.load.spritesheet('player', PlayerSprite, { frameWidth: 24, frameHeight: 32 });
			this.load.spritesheet('enemy', EnemySprite, { frameWidth: 24, frameHeight: 26 });
			this.load.image('resource-frame', ResourceFrame);
			//this.load.spritesheet('sword-fx', SwordSwing, { frameWidth: 96, frameHeight: 96 });
		}

		create (){
			let player_animations = [
				{key: "player-idle", frames: { start: 12, end: 17 }, repeat: -1},
				{key: "player-right-up", frames: { start: 0, end: 5 }, repeat: -1},
				{key: "player-left-down", frames: { start: 6, end: 11 }, repeat: -1},
				{key: "player-death", frames: { start: 18, end: 23 }, repeat: 0}
			]

			player_animations.forEach(animation => {
				this.anims.create({
					key: animation.key,
					frames: this.anims.generateFrameNumbers('player', animation.frames),
					frameRate: 12,
					repeat: animation.repeat
				});
			});

			let enemy_animations = [
				{key: "enemy-right-up", frames: { start: 0, end: 5 }},
				{key: "enemy-left-down", frames: { start: 6, end: 11 }}
			]

			enemy_animations.forEach(animation => {
				this.anims.create({
					key: animation.key,
					frames: this.anims.generateFrameNumbers('enemy', animation.frames),
					frameRate: 12,
					repeat: -1
				});
			});

			this.player = new Player({
				scene:this,
				x: 400,
				y: 400
			});

			let enemies = 5;
			this.group = this.add.group();

			for(let i = 0; i < enemies; i++){
				this.group.add(new Enemy({
					scene: this,
					key: 'enemy',
					x: Math.random() * 800,
					y: Math.random() * 100,
					name: "Bob",
					type: "zombie",
					damage: 50,
					speed: Math.random()*50 + 50,
					swing_speed: 2
				}));
			}

			//this.cameras.main.startFollow(this.player hero);

			this.input.mouse.capture = true;
			this.cursors = this.input.keyboard.createCursorKeys();

			this.physics.add.collider(this.player.hero, this);

			this.physics.add.collider(this.player.hero, this.group, this.player.enemyInRange, null, this.player);
			this.physics.add.collider(this.group, this.group);

			this.input.on('pointerdown', this.deselect, this);
		}

		update(time, delta) {
			let mouse = {
				pointer: this.input.activePointer,
				left: { isDown: (this.input.activePointer.buttons === 1 && this.input.activePointer.isDown) },
				middle: { isDown: (this.input.activePointer.buttons === 4 && this.input.activePointer.isDown) },
				right: { isDown: (this.input.activePointer.buttons === 2 && this.input.activePointer.isDown) },
			}
			if(this.player.hero.alive) this.player.update(mouse, this.cursors, time, delta);

			this.group.children.entries.forEach(entry =>{
				entry.update(time, delta);
			});
		}

		deselect(){			
			if(this.selected) this.selected.deselect();
		}
}

export default GameScene;