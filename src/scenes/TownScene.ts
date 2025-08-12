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
		// All town assets are now loaded in LoadScene
		// This method can be empty or removed entirely
	}

	create(): void {
		// Set current area in store
		store.dispatch(setCurrentArea("town"));
		
		const scene_padding = 40;
		this.global_game_width = Number(this.sys.game.config.width);
		this.global_game_height = Number(this.sys.game.config.height);
		this.zone = this.add.zone(scene_padding, scene_padding, this.global_game_width - (scene_padding*2), this.global_game_height - (scene_padding*2)).setOrigin(0);
		
		this.UI = new UI(this);

		// Set up pointer input for click-to-move
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

		// Create town map first to set up world bounds
		this.createTownEnvironment();

		// Create player after world bounds are set
		const character = this.config.type || store.getState().game.character;
		console.log('Character for town scene:', character);
		
		if (!character) {
			console.error("No character selected for town scene. Config:", this.config);
			throw new Error("No character selected for town scene");
		}

		try {
			this.player = new AssignClass(character, {
				scene: this,
				x: 90,
				y: 210
			}) as PlayerType;
			console.log('Player created successfully');
		} catch (error) {
			console.error('Error creating player:', error);
			throw error;
		}

		// Setup controls
		// Mouse capture - using type assertion for Phaser property
		if (this.input.mouse) {
			(this.input.mouse as Phaser.Input.Mouse.MouseManager & { capture: boolean }).capture = true;
		}
		if (this.input.keyboard) {
			this.cursors = this.input.keyboard.createCursorKeys();
			this.cursors.esc = this.input.keyboard.addKey(Input.Keyboard.KeyCodes.ESC);
		}

		// Set up collision detection and interaction zones from Tiled map
		this.setupCollisionAndInteractions();

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
			// Camera bounds will be set in createTownEnvironment based on map size
			console.log('Camera setup complete');
		} catch (error) {
			console.error('Error setting up camera:', error);
		}
	}

	private createTownEnvironment(): void {
		try {
			// Create tilemap from JSON file
			this.townMap = this.make.tilemap({ key: 'town-map' });
			
			// Add all tilesets used in the map (matching what's loaded in LoadScene)
			const tilesets = {
				forestVillageStructures: this.townMap.addTilesetImage('forestVillageStructures_ [stallsWatchtower]', 'forestVillageStructures'),
				forestVillageObjects: this.townMap.addTilesetImage('forestVillageObjects_', 'forestVillageObjects'),
				forestPath: this.townMap.addTilesetImage('forestPath_', 'forestPath'),
				forestBridgeHorizontal: this.townMap.addTilesetImage('forest_ [bridgeHorizontal]', 'forestBridgeHorizontal'),
				forestBridgeVertical: this.townMap.addTilesetImage('forest_ [bridgeVertical]', 'forestBridgeVertical'),
				forestFencesAndWalls: this.townMap.addTilesetImage('forest_ [fencesAndWalls]', 'forestFencesAndWalls'),
				forestFountain: this.townMap.addTilesetImage('forest_ [fountain]', 'forestFountain'),
				forestTerrain: this.townMap.addTilesetImage('forest_', 'forestTerrain'),
				greenHouse0: this.townMap.addTilesetImage('greenHouse_0_0', 'greenHouse0'),
				redHouse3: this.townMap.addTilesetImage('redHouse_3_0', 'redHouse3'),
				tableObjects: this.townMap.addTilesetImage('tableObjects_', 'tableObjects'),
				forestResources: this.townMap.addTilesetImage('forest_ [resources]-stash', 'forestResources'),
				furnace: this.townMap.addTilesetImage('furnace_', 'furnace'),
				stallObjects: this.townMap.addTilesetImage('stallObjects_', 'stallObjects')
			};

			// Create layers in the correct order
			const allTilesets = Object.values(tilesets).filter(tileset => tileset !== null);
			
			// Define layer names in rendering order
			const layerNames = [
				'terrain',
				'terrain props', 
				'structure',
				'structure props',
				'buildings',
				'building props',
				'shop props'
			];
			
			// Create and scale all layers (2x scaling)
			layerNames.forEach((layerName, index) => {
				const layer = this.townMap.createLayer(layerName, allTilesets);
				if (layer) {
					layer.setScale(2);
					// Store the first layer as groundLayer for reference
					if (index === 0) {
						this.groundLayer = layer;
					}
				}
			});
			
			// Set world bounds to match scaled map size (2x larger)
			const originalMapWidth = this.townMap.widthInPixels;
			const originalMapHeight = this.townMap.heightInPixels;
			const mapWidth = originalMapWidth * 4;
			const mapHeight = originalMapHeight * 4;
			
			console.log('Map dimensions - Original:', originalMapWidth, 'x', originalMapHeight, 'Scaled (2x):', mapWidth, 'x', mapHeight);
			
			this.physics.world.setBounds(0, 0, mapWidth, mapHeight);
			
			// Update camera bounds to match world bounds
			this.cameras.main.setBounds(0, 0, mapWidth, mapHeight);
			
			// Verify bounds were set correctly
			console.log('World bounds set to:', this.physics.world.bounds);
			console.log('Camera bounds set to:', this.cameras.main.getBounds());
			
		} catch (error) {
			console.error('Error loading Tiled map:', error);
			// Fallback to simple background
			this.createSimpleTownBackground();
		}
	}

	private setupCollisionAndInteractions(): void {
		if (!this.townMap) {
			// Fallback to simple interaction zones
			this.createInteractionZones();
			return;
		}

		try {
			// Set up collision with collision map object layer
			const collisionLayer = this.townMap.getObjectLayer('collision map');
			if (collisionLayer) {
				// Create collision bodies from object layer (scaled 2x to match map)
				collisionLayer.objects.forEach((obj: any) => {
					const scaledX = obj.x * 2;
					const scaledY = obj.y * 2;
					const scaledWidth = obj.width * 2;
					const scaledHeight = obj.height * 2;
					
					if (obj.polygon) {
						// Handle polygon collision objects - scale polygon points
						const scaledPolygon = obj.polygon.map((point: any) => ({ x: point.x * 2, y: point.y * 2 }));
						const collisionBody = this.add.polygon(scaledX, scaledY, scaledPolygon);
						this.physics.add.existing(collisionBody, true); // true = static body
						this.physics.add.collider(this.player, collisionBody);
					} else if (obj.ellipse) {
						// Handle ellipse collision objects
						const collisionBody = this.add.ellipse(scaledX + scaledWidth/2, scaledY + scaledHeight/2, scaledWidth, scaledHeight);
						this.physics.add.existing(collisionBody, true);
						this.physics.add.collider(this.player, collisionBody);
					} else {
						// Handle rectangle collision objects
						const collisionBody = this.add.rectangle(scaledX + scaledWidth/2, scaledY + scaledHeight/2, scaledWidth, scaledHeight);
						this.physics.add.existing(collisionBody, true);
						this.physics.add.collider(this.player, collisionBody);
					}
				});
				console.log(`Set up ${collisionLayer.objects.length} collision objects`);
			}

			// Set up interaction zones from POI layer
			const poiLayer = this.townMap.getObjectLayer('POI');
			if (poiLayer) {
				this.interactionZones = this.add.group();
				
				poiLayer.objects.forEach((poi: any) => {
					// Create interaction zone around each POI (scaled 2x to match map)
					const scaledX = poi.x * 2;
					const scaledY = poi.y * 2;
					const zone = this.add.zone(scaledX, scaledY, 64, 64); // 64x64 pixel interaction area (2x scaled)
					this.physics.world.enable(zone);
					
					// Map POI names to interaction types
					let interactionType = 'unknown';
					let displayName = poi.name;
					
					switch (poi.name) {
						case 'home':
							interactionType = 'inn';
							displayName = 'Home';
							break;
						case 'stash':
							interactionType = 'storage';
							displayName = 'Storage';
							break;
						case 'greathall':
							interactionType = 'inn';
							displayName = 'Great Hall';
							break;
						case 'armory':
							interactionType = 'shop';
							displayName = 'Armory';
							break;
						case 'alchemist':
							interactionType = 'shop';
							displayName = 'Alchemist';
							break;
						case 'arcanum':
							interactionType = 'shop';
							displayName = 'Arcanum';
							break;
						case 'merchant':
							interactionType = 'shop';
							displayName = 'Merchant';
							break;
						case 'blacksmith':
							interactionType = 'shop';
							displayName = 'Blacksmith';
							break;
						case 'entrance':
							interactionType = 'dungeon';
							displayName = 'Enter Dungeon';
							break;
					}
					
					zone.setData('type', interactionType);
					zone.setData('name', displayName);
					zone.setData('poi', poi.name);
					this.interactionZones.add(zone);
					
					// Add overlap detection
					this.physics.add.overlap(this.player, zone as Phaser.GameObjects.Zone, (player, zoneObj) => {
						this.handleZoneOverlap(player, zoneObj as Phaser.GameObjects.Zone);
					}, undefined, this);
				});
				
				console.log(`Set up ${poiLayer.objects.length} interaction zones from POI layer`);
			} else {
				// Fallback to simple interaction zones
				this.createInteractionZones();
			}
			
		} catch (error) {
			console.error('Error setting up collisions and interactions:', error);
			// Fallback to simple interaction zones
			this.createInteractionZones();
		}
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
		// UI elements will be added later
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
		}
	}

	private handleInteraction(type: string, name: string): void {
		// Save current position before leaving town
		store.dispatch(setPlayerPosition({ x: this.player.x, y: this.player.y }));

		switch (type) {
			case 'inn':
				console.log(`Entering ${name}...`);
				// Future: this.scene.start('InnScene', this.config);
				break;
			case 'shop':
				console.log(`Visiting ${name}...`);
				// Future: this.scene.start('ShopScene', { ...this.config, shopType: name });
				break;
			case 'storage':
				console.log(`Accessing ${name}...`);
				// Future: Open storage interface
				break;
			case 'dungeon':
				console.log('Entering dungeon...');
				store.dispatch(setCurrentArea("dungeon"));
				this.scene.start('GameScene', this.config);
				break;
			default:
				console.log(`Interacting with ${name}...`);
				break;
		}
	}

	update(time: number, delta: number): void {
		if (!this.player) return;

		// Handle player movement
		if(this.player.alive) {
			this.player.update(this.input.activePointer, this.cursors, time, delta);
		}

		// Interaction zone detection for future use
	}
}