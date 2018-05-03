import Player from '../Entities/Player/Player';
import Enemy from '../Entities/Enemy';
import UI from '../Entities/UI';
import waveConfig from '../Config/waves.json';

class GameScene extends Phaser.Scene {
	constructor() {
		super({
			key: 'GameScene'
		});

		this.global_tick = 0.2;
		this.global_swing_speed = 1;
		this.global_attack_delay = 250;
		this.global_spawn_time = 200;
		this.wave = 0;

		this.depth_group = {
			BASE: 10,
			UI: 10000,
		}
	}

	create (){
		let scene_padding = 30;
		this.global_game_width = this.sys.game.config.width;
		this.global_game_height = this.sys.game.config.height;
		this.zone = this.add.zone(scene_padding, scene_padding, this.global_game_width - (scene_padding*2), this.global_game_height - (scene_padding*2)).setOrigin(0);

		this.UI = new UI(this);

		this.input.on('pointerdown', (pointer, gameObject) => {
			// Only trigger this if there are no other game objects in the way.
			if(gameObject.length === 0) {
				this.events.emit('pointerdown:game', this)
			}
		});
		this.input.on('pointermove', () => {
			this.events.emit('pointermove:game', this)
		});
		this.input.on('pointerup', () => {
			this.events.emit('pointerup:game', this)
		});

		this.player = new Player({
			scene:this,
			x: 400,
			y: 400,
			primary_class: "cleric"
		});

		this.enemies = this.add.group();
		this.enemies.runChildUpdate = true;
		let enemy_array = waveConfig[this.wave];
		enemy_array.forEach((enemy, i, arr) => {
			//this.spawnEnemy(enemy);
			this.time.delayedCall(this.global_spawn_time * i, () => {
				this.spawnEnemy(enemy);
			}, [], this);
		});

		//this.cameras.main.startFollow(this.player hero);

		this.input.mouse.capture = true;
		this.cursors = this.input.keyboard.createCursorKeys();
		this.cursors.esc = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

		this.physics.add.collider(this.player.hero, this);

		this.events.on('pointerdown:enemy', this.select, this);
		this.events.on('pointerdown:game', this.deselect, this);
		this.events.once('player-dead', this.gameOver, this);

		// Resume physics if we load the scene post game over.
		this.physics.resume();
	}

	update(time, delta) {
		let mouse = {
			pointer: this.input.activePointer,
			left: { isDown: (this.input.activePointer.buttons === 1 && this.input.activePointer.isDown) },
			middle: { isDown: (this.input.activePointer.buttons === 4 && this.input.activePointer.isDown) },
			right: { isDown: (this.input.activePointer.buttons === 2 && this.input.activePointer.isDown) },
		}

		if(this.player.alive) this.player.update(mouse, this.cursors, time, delta);
	}

	select(enemy){
		this.selected = enemy;
	}

	deselect(){
		this.selected = null;
	}

	gameOver(){
		this.physics.pause();
		this.enemies.runChildUpdate = false;
		this.time.delayedCall(1500, () => this.scene.start('GameOverScene'), [], this);
	}

	spawnEnemy(enemy){
		let rand = Math.round(Math.random() * 5);
		this.enemies.add(new Enemy({
			scene: this,
			key: enemy,
			x: Math.random() * this.global_game_width,
			y: Math.random() * this.global_game_height,
			target: this.player
		}));
	}
}

export default GameScene;