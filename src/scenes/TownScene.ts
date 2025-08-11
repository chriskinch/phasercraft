import { Scene, GameObjects, Input } from 'phaser';
import AssignClass from "@entities/Player/AssignClass";
import store from "@store";
import { toggleHUD, setCurrentArea, setPlayerPosition } from "@store/gameReducer";
import { fontConfig } from '../config/fonts';
import type { PlayerType } from "@entities/Player/AssignClass";
import type { GameSceneConfig } from "@/scenes/SelectScene";
import UI from "@entities/UI/HUD";

export default class TownScene extends Scene {
	public player!: PlayerType;
	private config: GameSceneConfig;
	private cursors!: Phaser.Types.Input.Keyboard.CursorKeys & { esc?: Phaser.Input.Keyboard.Key };
	private global_game_width!: number;
	private global_game_height!: number;
	private townMap!: Phaser.Tilemaps.Tilemap;
	private groundLayer!: Phaser.Tilemaps.TilemapLayer;
	private buildingsLayer!: Phaser.Tilemaps.TilemapLayer;
	private interactionZones!: Phaser.GameObjects.Group;
	private townText!: Phaser.GameObjects.BitmapText;
	private welcomeText!: GameObjects.BitmapText;
	private instructionsText!: GameObjects.BitmapText;
	private zone!: Phaser.GameObjects.Zone;
	public depth_group: Record<string, number> = {
		BASE: 10,
		UI: 10000,
		TOP: 99999
	};
	private UI!: UI;

	constructor() {
		super({ key: 'TownScene' });
	}

	init(config: GameSceneConfig): void {
		this.config = config || {};
		console.log('TownScene initialized with config:', this.config);
	}

	preload(): void {
		// Load town-specific assets (optional - fallback to simple graphics if not found)
		// this.load.image("town-tiles", "graphics/tilesets/town_tileset.png");
		// this.load.tilemapTiledJSON('town-map', 'graphics/tilesets/town_map.json');
	}

	create(): void {
		// Set current area in store
		store.dispatch(setCurrentArea("town"));
		
		const scene_padding = 40;
		this.global_game_width = Number(this.sys.game.config.width);
		this.global_game_height = Number(this.sys.game.config.height);
		this.zone = this.add.zone(scene_padding, scene_padding, this.global_game_width - (scene_padding*2), this.global_game_height - (scene_padding*2)).setOrigin(0);
		
		this.UI = new UI(this);

		// Create player
		const character = this.config.type || store.getState().game.character;
		console.log('Character for town scene:', character);
		
		if (!character) {
			console.error("No character selected for town scene. Config:", this.config);
			throw new Error("No character selected for town scene");
		}

		const gameState = store.getState().game;
		const startPos = gameState.currentArea === "town" ? gameState.playerPosition : { x: 400, y: 300 };
		console.log('Player starting position in town:', startPos);

		try {
			this.player = new AssignClass(character, {
				scene: this,
				x: startPos.x,
				y: startPos.y
			}) as PlayerType;
			console.log('Player created successfully');
		} catch (error) {
			console.error('Error creating player:', error);
			throw error;
		}

		// Setup controls
		
		this.cursors = this.input.keyboard!.createCursorKeys();
		this.cursors.esc = this.input.keyboard!.addKey(Input.Keyboard.KeyCodes.ESC);

		// Create town map (fallback to simple background if tilemap doesn't exist)
		this.createTownEnvironment();

		// Create interaction zones
		this.createInteractionZones();

		// Create UI elements
		this.createTownUI();

		// Enable HUD
		try {
			store.dispatch(toggleHUD(true));
			console.log('HUD enabled');
		} catch (error) {
			console.error('Error enabling HUD:', error);
		}

		// Set camera to follow player
		try {
			this.cameras.main.startFollow(this.player);
			this.cameras.main.setBounds(0, 0, 800, 600);
			console.log('Camera setup complete');
		} catch (error) {
			console.error('Error setting up camera:', error);
		}
	}

	private createTownEnvironment(): void {
		// Always use simple background for now since tilemap assets don't exist
		this.createSimpleTownBackground();
	}

	private createSimpleTownBackground(): void {
		// Create a simple town background using graphics
		const graphics = this.add.graphics();
		
		// Ground
		graphics.fillStyle(0x4a7c59);
		graphics.fillRect(0, 0, 800, 600);
		
		// Town square
		graphics.fillStyle(0x8b7355);
		graphics.fillRect(200, 200, 400, 200);
		
		// Buildings (simple rectangles)
		graphics.fillStyle(0x8B4513);
		
		// Inn
		graphics.fillRect(50, 100, 120, 100);
		graphics.fillStyle(0xFF0000);
		graphics.fillRect(50, 80, 120, 20); // roof
		
		// Shop
		graphics.fillRect(630, 150, 120, 100);
		graphics.fillStyle(0xFF0000);
		graphics.fillRect(630, 130, 120, 20); // roof
		
		// Dungeon entrance
		graphics.fillStyle(0x2F4F2F);
		graphics.fillRect(350, 450, 100, 80);
		
		// Add some decorative elements
		graphics.fillStyle(0x228B22);
		graphics.fillCircle(150, 350, 30); // tree
		graphics.fillCircle(650, 350, 25); // tree
		graphics.fillCircle(400, 120, 20); // fountain center
	}

	private createInteractionZones(): void {
		this.interactionZones = this.add.group();

		// Inn entrance
		const innZone = this.add.zone(110, 200, 80, 40);
		this.physics.world.enable(innZone);
		innZone.setData('type', 'inn');
		innZone.setData('name', 'Sleeping Dragon Inn');
		this.interactionZones.add(innZone);

		// Shop entrance  
		const shopZone = this.add.zone(690, 250, 80, 40);
		this.physics.world.enable(shopZone);
		shopZone.setData('type', 'shop');
		shopZone.setData('name', 'General Store');
		this.interactionZones.add(shopZone);

		// Dungeon entrance
		const dungeonZone = this.add.zone(400, 490, 80, 40);
		this.physics.world.enable(dungeonZone);
		dungeonZone.setData('type', 'dungeon');
		dungeonZone.setData('name', 'Enter Dungeon');
		this.interactionZones.add(dungeonZone);

		// Add overlap detection
		this.interactionZones.children.entries.forEach(zone => {
			this.physics.add.overlap(this.player, zone as Phaser.GameObjects.Zone, (player, zoneObj) => {
				this.handleZoneOverlap(player, zoneObj as Phaser.GameObjects.Zone);
			}, undefined, this);
		});
	}

	private createTownUI(): void {
		// Create bitmap font if not already exists
		if (!this.cache.bitmapFont.exists('wayne-3d')) {
			this.cache.bitmapFont.add('wayne-3d', GameObjects.RetroFont.Parse(this, fontConfig));
		}

		// Welcome message
		this.welcomeText = this.add.bitmapText(400, 50, 'wayne-3d', 'Welcome to Millhaven').setOrigin(0.5);
		this.welcomeText.setDepth(1000);

		// Instructions
		this.instructionsText = this.add.bitmapText(400, 550, 'wayne-3d', 'Use ARROW KEYS to move, SPACE to interact').setOrigin(0.5);
		this.instructionsText.setDepth(1000);
	}

	private handleZoneOverlap(player: any, zone: Phaser.GameObjects.Zone): void {
		const zoneType = zone.getData('type');
		const zoneName = zone.getData('name');

		if (!zoneType || !zoneName) {
			console.warn('Zone missing type or name data:', zone);
			return;
		}

		// Show interaction prompt
		if (this.cursors.space?.isDown) {
			this.handleInteraction(zoneType, zoneName);
		} else {
			// Update instructions to show interaction is available
			this.instructionsText.setText(`Press SPACE to interact with ${zoneName}`);
		}
	}

	private handleInteraction(type: string, name: string): void {
		// Save current position before leaving town
		store.dispatch(setPlayerPosition({ x: this.player.x, y: this.player.y }));

		switch (type) {
			case 'inn':
				console.log('Entering inn...');
				// Future: this.scene.start('InnScene', this.config);
				break;
			case 'shop':
				console.log('Entering shop...');
				// Future: this.scene.start('ShopScene', this.config);
				break;
			case 'dungeon':
				console.log('Entering dungeon...');
				store.dispatch(setCurrentArea("dungeon"));
				this.scene.start('GameScene', this.config);
				break;
		}
	}

	update(time: number, delta: number): void {
		if (!this.player) return;

		// Handle player movement
		if(this.player.alive) {
			this.player.update(this.input.activePointer, this.cursors, time, delta);
		}

		// Reset instruction text when not near any zone
		let nearZone = false;
		this.interactionZones.children.entries.forEach(zone => {
			const playerBounds = this.player.getBounds();
			const zoneBounds = (zone as Phaser.GameObjects.Zone).getBounds();
			const distance = Phaser.Geom.Rectangle.Overlaps(playerBounds, zoneBounds);
			if (distance) {
				nearZone = true;
			}
		});

		if (!nearZone) {
			this.instructionsText.setText('Use ARROW KEYS to move, SPACE to interact');
		}
	}
}