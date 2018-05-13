import Player from '../Entities/Player/Player';
import Enemy from '../Entities/Enemy/Enemy';
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
			TOP: 99999
		}

		this.coins = 0;
	}

	create (){
		let scene_padding = 60;
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
		this.startLevel();

		this.setLevelCompleteUI();

		//this.cameras.main.startFollow(this.player hero);

		this.input.mouse.capture = true;
		this.cursors = this.input.keyboard.createCursorKeys();
		this.cursors.esc = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

		this.physics.add.collider(this.player.hero, this);

		this.events.once('player:dead', this.gameOver, this);

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

		if(this.enemies.children.entries.length === 0 && !this.game_over) this.events.emit('enemies:dead');

		if(this.player.alive) this.player.update(mouse, this.cursors, time, delta);
	}

	increaseLevel(){
		this.wave++;
		this.level_complete.setVisible(false);
		this.level_complete.button.input.enabled = false;
		this.startLevel();
	}

	startLevel(){
		this.time.paused = false;
		let enemy_array = waveConfig[this.wave];
		enemy_array.forEach((enemy, i, arr) => {
			this.time.delayedCall(this.global_spawn_time * i, () => {
				this.spawnEnemy(enemy);
				// Set the level complete event once all enemies have spawned.
				if(i === this.wave) this.events.once('enemies:dead', this.levelComplete, this);
			}, [], this);
		});
	}

	gameOver(){
		this.game_over = true;
		this.physics.pause();
		this.enemies.runChildUpdate = false;
		this.time.delayedCall(1500, () => this.scene.start('GameOverScene'), [], this);
	}

	setLevelCompleteUI(){
		this.level_complete = this.add.container(300, 300).setDepth(this.depth_group.TOP).setVisible(false);
		Phaser.Display.Align.In.Center(this.level_complete, this.zone);

		this.cache.bitmapFont.add('wayne-3d', Phaser.GameObjects.RetroFont.Parse(this, this.sys.game.font_config));
		this.level_complete.add(this.add.bitmapText(0, 0, 'wayne-3d', 'LEVEL COMPLETE').setOrigin(0.5).setScale(2));
		this.level_complete.add(this.add.bitmapText(0, 60, 'wayne-3d', 'NEXT').setOrigin(0.5));
		this.level_complete.button = this.make.image({key:'blank-gif', x:0, y:60}).setScale(13, 4).setInteractive();
		this.level_complete.add(this.level_complete.button);
	}

	levelComplete(){
		// Level complete activates 1.5 seconds after the last enemy dies to give time for loot to activate.
		this.time.delayedCall(1500, () => {
			this.time.paused = true;
			this.level_complete.setVisible(true);
			this.level_complete.button.input.enabled = true;
			this.level_complete.button.once('pointerup', this.increaseLevel, this);
		}, [], this);
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