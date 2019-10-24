import { Scene, Input, GameObjects, Display } from 'phaser';
import AssignClass from '../Entities/Player/AssignClass';
import Enemy from '../Entities/Enemy/Enemy';
import UI from '../Entities/UI/HUD';
import waveConfig from '../Config/waves.json';
import enemyTypes from '../Config/enemies.json';
import LootTable from '../Entities/Loot/LootTable';

export default class GameScene extends Scene {
	constructor() {
		super({
			key: 'GameScene'
		});

		this.global_tick = 0.2;
		this.global_attack_speed = 1;
		this.global_attack_delay = 250;
		this.global_spawn_time = 200;
		this.wave = 0;

		this.depth_group = {
			BASE: 10,
			UI: 10000,
			TOP: 99999
		}

		this.coins = 0;

		this.loot_table = new LootTable();
	}

	init(config) {
		this.config = config;
	}

	create (){
		const scene_padding = 40;
		this.global_game_width = this.sys.game.config.width;
		this.global_game_height = this.sys.game.config.height;
		this.zone = this.add.zone(scene_padding, scene_padding, this.global_game_width - (scene_padding*2), this.global_game_height - (scene_padding*2)).setOrigin(0);

		this.UI = new UI(this);

		this.input.on('pointerdown', (pointer, gameObject) => {
			// Only trigger this if there are no other game objects in the way.
			if(gameObject.length === 0) {
				this.events.emit('pointerdown:game', this, this.input.activePointer);
			}
		});
		this.input.on('pointermove', () => {
			this.events.emit('pointermove:game', this, this.input.activePointer)
		});
		this.input.on('pointerup', () => {
			this.events.emit('pointerup:game', this)
		});

		const typeClass = this.config.type.charAt(0).toUpperCase() + this.config.type.substring(1);
		this.player = new AssignClass(typeClass, {
			scene:this,
			x: 100,
			y: 100
		});

		this.enemies = this.add.group();
		this.enemies.runChildUpdate = true;
		this.active_enemies = this.add.group();
		this.startLevel();

		this.setLevelCompleteUI();

		//this.cameras.main.startFollow(this.player hero);

		this.input.mouse.capture = true;
		this.cursors = this.input.keyboard.createCursorKeys();
		this.cursors.esc = this.input.keyboard.addKey(Input.Keyboard.KeyCodes.ESC);

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

		if(this.enemies.getChildren().length === 0 && !this.game_over) this.events.emit('enemies:dead');

		if(this.player.alive) this.player.update(mouse, this.cursors, time, delta);
	}

	increaseLevel(){
		this.wave++;
		this.events.emit('increment:wave');
		this.level_complete.setVisible(false);
		this.level_complete.button.input.enabled = false;
		this.startLevel(this.wave);
	}

	startLevel(wave = 0){
		this.time.paused = false;
		const enemies = waveConfig[wave];

		if(typeof enemies === "object") {
			this.spawnEnemies(enemies);
		}else{
			const types = Object.keys(enemyTypes);
			const randomEnemies = Array.from({length: wave+1}, () => {
				let random = Math.floor(Math.random() * types.length);
				return types[random];
			});
			this.spawnEnemies(randomEnemies);
		}
	}

	gameOver(){
		this.game_over = true;
		this.physics.pause();
		this.enemies.runChildUpdate = false;
		this.time.delayedCall(1500, () => this.scene.start('GameOverScene'), [], this);
	}

	setLevelCompleteUI(){
		this.level_complete = this.add.container(300, 300).setDepth(this.depth_group.TOP).setVisible(false);
		Display.Align.In.Center(this.level_complete, this.zone);

		this.cache.bitmapFont.add('wayne-3d', GameObjects.RetroFont.Parse(this, this.sys.game.font_config));
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

	waveCompleteDelay() {
		this.removeNextLevelTimer();
		// Pause time after a short delay so that loot has a change to animate and activate
		this.time.delayedCall(1000, () => {
			this.time.paused = true;
		}, [], this);
		// Give the player time to collect loot and cast spells.
		// We use a regular setTimeout here as the game timers are paused.
		setTimeout(() => { this.increaseLevel() }, 4000);
	}

	spawnEnemies(list){
		// Remove exsiting instances of this event so that it does trigger multiple times
		this.events.off('enemies:dead');
		
		list.forEach((enemy, i) => {
			this.time.delayedCall(this.global_spawn_time * i, () => {
				this.spawnEnemy(enemy);
			});
		});

		this.events.once('enemies:dead', this.waveCompleteDelay, this);
		this.setNextLevelTimer();
	}

	spawnEnemy(enemy){
		this.enemies.add(new Enemy({
			scene: this,
			key: enemy,
			x: Math.random() * this.global_game_width,
			y: Math.random() * this.global_game_height,
			target: this.player,
			active_group: this.active_enemies
		}));
	}

	removeNextLevelTimer() {
		if(this.next_level_timer) {
			this.next_level_timer.remove(false);
			delete this.next_level_timer;
		}
	}

	setNextLevelTimer() {
		// If all enemies are killed and next level time gets set again
		// remove the first time so it doesn't trigger twice
		this.removeNextLevelTimer();

		// TODO: Make the timings smarter
		const time_scale = 5000;
		const n_wave = this.wave+1;
		const min_delay = n_wave * this.global_spawn_time;
		const wave_offset = n_wave * time_scale;
		const time_limit = min_delay + wave_offset + time_scale;
		this.next_level_timer = this.time.delayedCall(time_limit, this.increaseLevel, [], this);
	}
}