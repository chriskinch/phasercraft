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

		const character = this.config.type || store.getState().game.character;
		if (!character) throw new Error("No character selected for town scene");
		this.player = new AssignClass(character, {
			scene: this,
			x: 90,
			y: 210
		}) as PlayerType;

		if (this.input.mouse) {
			(this.input.mouse as Phaser.Input.Mouse.MouseManager & { capture: boolean }).capture = true;
		}
		if (this.input.keyboard) {
			this.cursors = this.input.keyboard.createCursorKeys();
			this.cursors.esc = this.input.keyboard.addKey(Input.Keyboard.KeyCodes.ESC);
		}

		// this.setupCollisionAndInteractions();

		this.createTownUI();

		store.dispatch(toggleHUD(true));

		this.cameras.main.startFollow(this.player);
	}

	private createTownEnvironment(): void {
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
			forestResources: this.townMap.addTilesetImage('forest_ [resources]', 'forestResources'),
			stallObjects: this.townMap.addTilesetImage('stallObjects_', 'stallObjects'),
			furnace: this.townMap.addTilesetImage('furnace_', 'furnace', 32, 48, 0, 0),
			fire: this.townMap.addTilesetImage('fire', 'fire', 16, 32, 0, 0),
			fountain: this.townMap.addTilesetImage('fountain', 'fountain', 64, 80, 0, 0)
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
			let layer;
			if(layerName === 'structure props') {
				layer = this.townMap.createLayer(layerName, allTilesets);
			}else{
				layer = this.townMap.createLayer(layerName, allTilesets);
			}
			console.log(`Created layer: `, layer);
			if (layer) {
				layer.setScale(2);
			}
		});
		
		// Create objects from object layers
		this.createObjectLayers();
		
		// Set world bounds to match scaled map size (2x larger)
		const originalMapWidth = this.townMap.widthInPixels;
		const originalMapHeight = this.townMap.heightInPixels;
		const mapWidth = originalMapWidth * 2;
		const mapHeight = originalMapHeight * 2;
		
		console.log('Map dimensions - Original:', originalMapWidth, 'x', originalMapHeight, 'Scaled (2x):', mapWidth, 'x', mapHeight);
		
		this.physics.world.setBounds(0, 0, mapWidth, mapHeight);
		
		// Update camera bounds to match world bounds
		this.cameras.main.setBounds(0, 0, mapWidth, mapHeight);
	}

	private createObjectLayers(): void {
		// Create fire objects from the fire object layer
		const fireLayer = this.townMap.getObjectLayer('fire');
		if (fireLayer) {
			fireLayer.objects.forEach((fireObj: any) => {
				// Scale position to match 2x scaled map
				const scaledX = fireObj.x * 2;
				const scaledY = fireObj.y * 2;
				
				// Create fire sprite using the tileset
				const fireSprite = this.add.sprite(scaledX, scaledY, 'fire');
				fireSprite.setScale(2); // Match map scaling
				fireSprite.setOrigin(0, 1); // Align to bottom-left like Tiled objects
				
				// Create fire animation if it doesn't exist
				if (!this.anims.exists('fire-anim')) {
					this.anims.create({
						key: 'fire-anim',
						frames: this.anims.generateFrameNumbers('fire', { start: 0, end: 3 }),
						frameRate: 10,
						repeat: -1
					});
				}
				
				// Play the fire animation
				fireSprite.play('fire-anim');
			});
			
			console.log(`Created ${fireLayer.objects.length} fire objects`);
		}
		
		// Create furnace objects from the furnace object layer
		const furnaceLayer = this.townMap.getObjectLayer('furnace');
		if (furnaceLayer) {
			furnaceLayer.objects.forEach((furnaceObj: any) => {
				const scaledX = furnaceObj.x * 2;
				const scaledY = furnaceObj.y * 2;
				
				const furnaceSprite = this.add.sprite(scaledX, scaledY, 'furnace');
				furnaceSprite.setScale(2);
				furnaceSprite.setOrigin(0, 1);
				
				// Create furnace animation if it doesn't exist
				if (!this.anims.exists('furnace-anim')) {
					this.anims.create({
						key: 'furnace-anim',
						frames: this.anims.generateFrameNumbers('furnace', { start: 0, end: 7 }), // 8 frame animation (frames 0-7)
						frameRate: 8,
						repeat: -1
					});
				}
				
				// Play the furnace animation
				furnaceSprite.play('furnace-anim');
			});
			
			console.log(`Created ${furnaceLayer.objects.length} furnace objects`);
		}
		
		// Create fountain objects from the fountain object layer
		const fountainLayer = this.townMap.getObjectLayer('fountain');
		if (fountainLayer) {
			fountainLayer.objects.forEach((fountainObj: any) => {
				const scaledX = fountainObj.x * 2;
				const scaledY = fountainObj.y * 2;
				
				const fountainSprite = this.add.sprite(scaledX, scaledY, 'fountain');
				fountainSprite.setScale(2);
				fountainSprite.setOrigin(0, 1);
				
				// Create fountain animation if it doesn't exist
				if (!this.anims.exists('fountain-anim')) {
					this.anims.create({
						key: 'fountain-anim',
						frames: this.anims.generateFrameNumbers('fountain', { start: 0, end: -1 }), // Use all frames
						frameRate: 6, // Slower animation for water flow
						repeat: -1
					});
				}
				
				// Play the fountain animation
				fountainSprite.play('fountain-anim');
			});
			
			console.log(`Created ${fountainLayer.objects.length} fountain objects`);
		}
		
		// Create stash objects from the stash object layer
		const stashLayer = this.townMap.getObjectLayer('stash');
		if (stashLayer) {
			stashLayer.objects.forEach((stashObj: any) => {
				const scaledX = stashObj.x * 2;
				const scaledY = stashObj.y * 2;
				
				const stashSprite = this.add.sprite(scaledX, scaledY, 'forestResources');
				stashSprite.setScale(2);
				stashSprite.setOrigin(0, 1);
			});
			
			console.log(`Created ${stashLayer.objects.length} stash objects`);
		}
	}

	private setupCollisionAndInteractions(): void {
		// Set up collision with collision map object layer
		const collisionLayer = this.townMap.getObjectLayer('collision map');
		if (!collisionLayer) throw Error("Collision layer failed to load!") 
		
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
		}
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