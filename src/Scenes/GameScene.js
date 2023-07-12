import { Scene, Input, GameObjects, Display } from "phaser"
import AssignClass from "@Entities/Player/AssignClass"
import AssignType from "@Entities/Enemy/AssignType"
import Boss from "@Entities/Enemy/Boss"
import UI from "@Entities/UI/HUD"
import waveConfig from "@Config/waves.json"
import enemyTypes from "@Config/enemies.json"
import bossTypes from "@Config/bosses.json"
import sample from "lodash/sample"

import { nextWave, toggleHUD } from "@store/gameReducer"
import store from "@store"

export default class GameScene extends Scene {
	constructor() {
		super({
			key: 'GameScene'
		});

		this.global_tick = 0.2;
		this.global_attack_speed = 1;
		this.global_attack_delay = 250;
		this.global_spawn_time = 200;
		// this.wave = 0;

		this.depth_group = {
			BASE: 10,
			UI: 10000,
			TOP: 99999
		}

		// store.dispatch(generateLootTable(45));
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
		this.startLevel(store.getState().wave);

		this.setLevelCompleteUI();

		//this.cameras.main.startFollow(this.player hero);

		this.input.mouse.capture = true;
		this.cursors = this.input.keyboard.createCursorKeys();
		this.cursors.esc = this.input.keyboard.addKey(Input.Keyboard.KeyCodes.ESC);

		this.physics.add.collider(this.player.hero, this);

		this.events.once('player:dead', this.gameOver, this);

		// When loading from an array, make sure to specify the tileWidth and tileHeight
		// const map = this.make.tilemap({ key: "map"});
		// const tileset = map.addTilesetImage("tileset_organic", "tiles", 16, 16, 1, 2);
		// this.mapset = {
		// 	base: map.createStaticLayer("base", tileset, 0, 0),
		// 	trees: map.createStaticLayer("trees", tileset, 0, 0),
		// 	bushes: map.createStaticLayer("bushes", tileset, 0, 0),
		// 	ore: map.createStaticLayer("ore", tileset, 0, 0),
		// 	details: map.createStaticLayer("details", tileset, 0, 0)
		// }
		// this.mapset.trees.setCollisionByProperty({ collides: true });
		// this.mapset.bushes.setCollisionByProperty({ collides: true });
		// this.mapset.ore.setCollisionByProperty({ collides: true });
		// this.mapset.details.setCollisionByProperty({ collides: true });

		// const debugGraphics = this.add.graphics().setAlpha(0.75);
		// mapset.trees.renderDebug(debugGraphics, {
		// 	tileColor: null, // Color of non-colliding tiles
		// 	collidingTileColor: new Display.Color(243, 134, 48, 255), // Color of colliding tiles
		// 	faceColor: new Display.Color(40, 39, 37, 255) // Color of colliding face edges
		// });

		// Camera
		// const camera = this.cameras.main;
		// camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
		// camera.startFollow(this.player);

		// this.physics.add.collider(this.player, this.mapset.trees);
		// this.physics.add.collider(this.player, this.mapset.bushes);
		// this.physics.add.collider(this.player, this.mapset.ore);
		// this.physics.add.collider(this.player, this.mapset.details);

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
		store.dispatch(nextWave());
		// this.wave++;
		// this.events.emit('increment:wave');
		// this.level_complete.setVisible(false);
		// this.level_complete.button.input.enabled = false;
		this.startLevel(store.getState().wave);
	}

	startLevel(wave = 1){
		// this.time.paused = false;
		const enemies = waveConfig[wave - 1];
		const types = Object.keys(enemyTypes);

		if(typeof enemies === "object") {
			// Spawn the list of predefined enemies from the wave json
			this.spawnEnemies(enemies);
		}else{
			const wave_set = Math.floor(store.getState().wave / 10);
			const wave_sub = store.getState().wave % 10;
			const boss_wave = wave_sub === 0 ? true : false;
			if(boss_wave) {
				// If the wave is a multiple of 10 it's a boss!
				this.spawnBoss(types);
			}else{
				// Other wise spawn x random enemies scaling every 10 levels
				const sampleEnemies = Array.from({length: wave_set + 2 }, () => sample(types));
				this.spawnEnemies(sampleEnemies, wave_set);
			}
		}
	}

	gameOver(){
		this.game_over = true;
		this.physics.pause();
		this.enemies.runChildUpdate = false;
		this.time.delayedCall(1500, () => {
			store.dispatch(toggleHUD());
			this.scene.start('GameOverScene');
		}, [], this);
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

	waveComplete() {
		// this.removeNextLevelTimer();
		// Pause time after a short delay so that loot has a change to animate and activate
		// this.time.delayedCall(1000, () => {
		// 	this.time.paused = true;
		// }, [], this);
		// Give the player time to collect loot and cast spells.
		// We use a regular setTimeout here as the game timers are paused.
		setTimeout(() => { this.increaseLevel() }, 4000);
	}

	spawnEnemies(list, set){
		// Remove exsiting instances of this event so that it does trigger multiple times
		this.events.off('enemies:dead');
		
		list.forEach((enemy, i) => {
			this.time.delayedCall(this.global_spawn_time * i, () => {
				this.spawnEnemy(enemy, set);
			});
		});

		this.events.once('enemies:dead', this.waveComplete, this);
		// this.setNextLevelTimer();
	}

	spawnEnemy(enemy, set){
		this.enemies.add(new AssignType(enemyTypes[enemy].type, {
			scene: this,
			key: enemy,
			x: Math.random() * this.global_game_width,
			y: Math.random() * this.global_game_height,
			attributes: enemyTypes[enemy],
			target: null, //this.player,
			active_group: this.active_enemies,
			set: set
		}));
	}

	spawnBoss(types) {
		this.events.off('enemies:dead');

		this.enemies.add(new Boss({
			scene: this,
			key: sample(types),
			x: Math.random() * this.global_game_width,
			y: Math.random() * this.global_game_height,
			types: bossTypes,
			target: this.player,
			active_group: this.active_enemies
		}));

		this.events.once('enemies:dead', this.waveComplete, this);
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
		const n_wave = store.getState().wave+1;
		const min_delay = n_wave * this.global_spawn_time;
		const wave_offset = n_wave * time_scale;
		const time_limit = min_delay + wave_offset + time_scale;
		this.next_level_timer = this.time.delayedCall(time_limit, this.increaseLevel, [], this);
	}
}