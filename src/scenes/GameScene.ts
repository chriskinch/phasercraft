import { Scene, Input, GameObjects, Display } from "phaser"
import AssignClass from "@entities/Player/AssignClass"
import AssignType from "@entities/Enemy/AssignType"
import Boss from "@entities/Enemy/Boss"
import UI from "@entities/UI/HUD"
import waveConfig from "@config/waves.json"
import enemyTypes from "@config/enemies.json"
import bossTypes from "@config/bosses.json"
import { sample } from "lodash"
import { fontConfig } from "../config/fonts"

import { nextWave, toggleHUD } from "@store/gameReducer"
import store from "@store"

export default class GameScene extends Scene {
	private global_tick: number = 42;
	private global_attack_speed: number = 1;
	private global_attack_delay: number = 250;
	private global_spawn_time: number = 200;
	private global_game_width!: number;
	private global_game_height!: number;
	private zone!: Phaser.GameObjects.Zone;
	private player!: any; // Player instance from AssignClass factory
	private enemies!: Phaser.GameObjects.Group;
	private active_enemies!: Phaser.GameObjects.Group;
	private game_over: boolean = false;
	private depth_group: Record<string, number> = {
		BASE: 10,
		UI: 10000,
		TOP: 99999
	};
	private level_complete!: Phaser.GameObjects.Container & { button?: Phaser.GameObjects.Image };
	private config: any;
	private cursors!: Phaser.Types.Input.Keyboard.CursorKeys & { esc?: Phaser.Input.Keyboard.Key };
	private next_level_timer: Phaser.Time.TimerEvent | undefined;
	private UI!: UI;

	constructor() {
		super({ key: 'GameScene' });
	}

	init(config: any): void {
		this.config = config;
	}

	create(): void {
		const scene_padding = 40;
		this.global_game_width = Number(this.sys.game.config.width);
		this.global_game_height = Number(this.sys.game.config.height);
		this.zone = this.add.zone(scene_padding, scene_padding, this.global_game_width - (scene_padding*2), this.global_game_height - (scene_padding*2)).setOrigin(0);

		this.UI = new UI(this);

		this.input.on('pointerdown', (pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.GameObject[]) => {
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
		this.startLevel(store.getState().game.wave);

		this.setLevelCompleteUI();

		//this.cameras.main.startFollow(this.player hero);

		// Mouse capture - using type assertion for Phaser property
		if (this.input.mouse) {
			(this.input.mouse as any).capture = true;
		}
		if (this.input.keyboard) {
			this.cursors = this.input.keyboard.createCursorKeys();
			this.cursors.esc = this.input.keyboard.addKey(Input.Keyboard.KeyCodes.ESC);
		}

		// this.physics.add.collider(this.player.hero, this); // Commented out - invalid collider

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

	update(time: number, delta: number): void {
		let mouse = {
			pointer: this.input.activePointer,
			left: { isDown: (this.input.activePointer.buttons === 1 && this.input.activePointer.isDown) },
			middle: { isDown: (this.input.activePointer.buttons === 4 && this.input.activePointer.isDown) },
			right: { isDown: (this.input.activePointer.buttons === 2 && this.input.activePointer.isDown) },
		}

		if(this.enemies.getChildren().length === 0 && !this.game_over) this.events.emit('enemies:dead');

		if(this.player.alive) this.player.update(mouse, this.cursors, time, delta);
	}

	increaseLevel(): void {
		store.dispatch(nextWave());
		// this.wave++;
		// this.events.emit('increment:wave');
		// this.level_complete.setVisible(false);
		// this.level_complete.button.input.enabled = false;
		this.startLevel(store.getState().game.wave);
	}

	startLevel(wave: number = 1): void {
		// this.time.paused = false;
		const enemies = waveConfig[wave - 1];
		const types = Object.keys(enemyTypes);

		if(typeof enemies === "object") {
			// Spawn the list of predefined enemies from the wave json
			this.spawnEnemies(enemies);
		}else{
			const wave_set = Math.floor(store.getState().game.wave / 10);
			const wave_sub = store.getState().game.wave % 10;
			const boss_wave = wave_sub === 0 ? true : false;
			if(boss_wave) {
				// If the wave is a multiple of 10 it's a boss!
				this.spawnBoss(types);
			}else{
				// Other wise spawn x random enemies scaling every 10 levels
				const sampleEnemies = Array.from({length: wave_set + 2 }, () => sample(types)).filter((enemy): enemy is string => enemy !== undefined);
				this.spawnEnemies(sampleEnemies, wave_set);
			}
		}
	}

	gameOver(): void {
		this.game_over = true;
		this.physics.pause();
		this.enemies.runChildUpdate = false;
		this.time.delayedCall(1500, () => {
			store.dispatch(toggleHUD(false));
			this.scene.start('GameOverScene');
		}, [], this);
	}

	setLevelCompleteUI(): void {
		this.level_complete = this.add.container(300, 300).setDepth(this.depth_group.TOP).setVisible(false);
		Display.Align.In.Center(this.level_complete, this.zone);

		this.cache.bitmapFont.add('wayne-3d', GameObjects.RetroFont.Parse(this, fontConfig));
		this.level_complete.add(this.add.bitmapText(0, 0, 'wayne-3d', 'LEVEL COMPLETE').setOrigin(0.5).setScale(2));
		this.level_complete.add(this.add.bitmapText(0, 60, 'wayne-3d', 'NEXT').setOrigin(0.5));
		this.level_complete.button = this.make.image({key:'blank-gif', x:0, y:60}).setScale(13, 4).setInteractive();
		this.level_complete.add(this.level_complete.button);
	}

	levelComplete(): void {
		// Level complete activates 1.5 seconds after the last enemy dies to give time for loot to activate.
		this.time.delayedCall(1500, () => {
			this.time.paused = true;
			this.level_complete.setVisible(true);
			if (this.level_complete.button) {
				this.level_complete.button.input!.enabled = true;
				this.level_complete.button.once('pointerup', this.increaseLevel, this);
			}
		}, [], this);
	}

	waveComplete(): void {
		// this.removeNextLevelTimer();
		// Pause time after a short delay so that loot has a change to animate and activate
		// this.time.delayedCall(1000, () => {
		// 	this.time.paused = true;
		// }, [], this);
		// Give the player time to collect loot and cast spells.
		// We use a regular setTimeout here as the game timers are paused.
		setTimeout(() => { this.increaseLevel() }, 4000);
	}

	spawnEnemies(list: string[], set?: number): void {
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

	spawnEnemy(enemy: string, set?: number): void {
		this.enemies.add(new AssignType((enemyTypes as any)[enemy].type, {
			scene: this,
			key: enemy,
			x: Math.random() * this.global_game_width,
			y: Math.random() * this.global_game_height,
			attributes: (enemyTypes as any)[enemy],
			target: null, //this.player,
			active_group: this.active_enemies,
			coin_multiplier: (enemyTypes as any)[enemy].coin_multiplier || 1,
			set: set
		}) as any);
	}

	spawnBoss(types: string[]): void {
		this.events.off('enemies:dead');

		this.enemies.add(new Boss({
			scene: this,
			key: sample(types) || types[0],
			x: Math.random() * this.global_game_width,
			y: Math.random() * this.global_game_height,
			types: bossTypes,
			target: this.player,
			active_group: this.active_enemies
		}) as any);

		this.events.once('enemies:dead', this.waveComplete, this);
	}

	removeNextLevelTimer(): void {
		if(this.next_level_timer) {
			this.next_level_timer.remove(false);
			delete this.next_level_timer;
		}
	}

	setNextLevelTimer(): void {
		// If all enemies are killed and next level time gets set again
		// remove the first time so it doesn't trigger twice
		this.removeNextLevelTimer();

		// TODO: Make the timings smarter
		const time_scale = 5000;
		const n_wave = store.getState().game.wave+1;
		const min_delay = n_wave * this.global_spawn_time;
		const wave_offset = n_wave * time_scale;
		const time_limit = min_delay + wave_offset + time_scale;
		this.next_level_timer = this.time.delayedCall(time_limit, this.increaseLevel, [], this);
	}
}