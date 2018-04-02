import PlayerSprite from '../Graphics/player.png';
import EnemySprite from '../Graphics/enemy.png';
//import SwordSwing from '../Graphics/sword-swing-plain.png';
import Hero from '../Entities/Hero';
import Enemy from '../Entities/Enemy';

class GameScene extends Phaser.Scene {
		constructor() {
			super({
				key: 'GameScene'
			});
		}

		preload (){
			this.load.spritesheet('player', PlayerSprite, { frameWidth: 24, frameHeight: 32 });
			this.load.spritesheet('enemy', EnemySprite, { frameWidth: 24, frameHeight: 26 });
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

			// this.anims.create({
			// 	key: 'sword-swing-plain',
			// 	frames: this.anims.generateFrameNumbers('sword-fx', { start: 0, end: 5}),
			// 	frameRate: 12,
			// 	repeat: -1
			// });

			// let sword = this.add.sprite(400, 300, 'sword-fx');
			// sword.anims.play('sword-swing-plain');
			// sword.depth = 10;
			
			this.hero = new Hero({
				scene: this,
				key: 'player',
				x: 16 * 6, // 3500, 
				y: this.sys.game.config.height - 48 - 48,
				name: "Chris",
				primary_class: "cleric",
				secondary_class: "warrior"
			});

			this.enemy = new Enemy({
				scene: this,
				key: 'enemy',
				x: 600,
				y: 100,
				name: "Bob",
				type: "zombie"
			});

			//this.cameras.main.startFollow(this.hero);

			this.input.mouse.capture = true;
			this.cursors = this.input.keyboard.createCursorKeys();


			this.physics.add.collider(this.hero, this.enemy, this.gameOver, null, this);
		}

		update(time, delta) {
			let mouse = {
				pointer: this.input.activePointer,
				left: { isDown: (this.input.activePointer.buttons === 1 && this.input.activePointer.isDown) },
				middle: { isDown: (this.input.activePointer.buttons === 4 && this.input.activePointer.isDown) },
				right: { isDown: (this.input.activePointer.buttons === 2 && this.input.activePointer.isDown) },
			}

			if(this.hero.alive) this.hero.update(mouse, this.cursors, time, delta);
			this.enemy.update(time, delta);
		}

		gameOver() {
			this.physics.pause();
			this.hero.death();
		}
}

export default GameScene;