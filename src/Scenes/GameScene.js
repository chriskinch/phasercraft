import PlayerSprite from '../Graphics/player.png';
import EnemySprite from '../Graphics/enemy.png';
import ResourceFrame from '../Graphics/resource-frame.png';
//import SwordSwing from '../Graphics/sword-swing-plain.png';
import Hero from '../Entities/Hero';
import Player from '../Entities/Player';
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

			this.enemy = new Enemy({
				scene: this,
				key: 'enemy',
				x: 600,
				y: 100,
				name: "Bob",
				type: "zombie"
			});

			//this.cameras.main.startFollow(this.player hero);

			this.input.mouse.capture = true;
			this.cursors = this.input.keyboard.createCursorKeys();

			this.physics.add.collider(this.player.hero, this.enemy, this.gameOver, null, this);
		}

		update(time, delta) {
			let mouse = {
				pointer: this.input.activePointer,
				left: { isDown: (this.input.activePointer.buttons === 1 && this.input.activePointer.isDown) },
				middle: { isDown: (this.input.activePointer.buttons === 4 && this.input.activePointer.isDown) },
				right: { isDown: (this.input.activePointer.buttons === 2 && this.input.activePointer.isDown) },
			}
			if(this.player.hero.alive) this.player.update(mouse, this.cursors, time, delta);
			this.enemy.update(time, delta);
		}

		gameOver() {
			this.player.setResource('health', -10);
			console.log(this.player.getResource('health'))
			if(this.player.getResource('health') <= 0) {
				this.physics.pause();
				this.player.hero.death();
			}
		}
}

export default GameScene;