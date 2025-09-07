import { Scene, GameObjects, Input, Tilemaps } from 'phaser';
import AssignClass from "@entities/Player/AssignClass";
import store from "@store";
import { toggleHUD, setCurrentArea, setPlayerPosition } from "@store/gameReducer";
import type { PlayerType } from "@entities/Player/AssignClass";
import type Player from "@entities/Player/Player";
import type { GameSceneConfig } from "@/scenes/SelectScene";
import UI from "@entities/UI/HUD";

export default class TownScene extends Scene {
	public player!: PlayerType;
	private config: GameSceneConfig;
	private cursors!: Phaser.Types.Input.Keyboard.CursorKeys & { esc?: Input.Keyboard.Key };
	private global_game_width!: number;
	private global_game_height!: number;
	private townMap!: Tilemaps.Tilemap;
	private interactionZones!: GameObjects.Group;
	private zone!: GameObjects.Zone;
	public depth_group: Record<string, number> = {
		BASE: 10,
		UI: 10000,
		TOP: 99999
	};
	// Depth sorting function based on Y position
	private setDepthByY(sprite: GameObjects.Sprite | Player | Tilemaps.TilemapLayer, offset: number = 0): void {
		const depth = sprite.y + sprite.height + offset;
		sprite.setDepth(depth);
	}
	
	// Abstracted animation creation function
	private createAnimationForSprite(sprite: GameObjects.Sprite, animConfig: {
		key: string;
		frameStart: number;
		frameEnd: number;
		frameRate: number;
		repeat?: number;
	}): void {
		// Create animation if it doesn't exist
		if (!this.anims.exists(animConfig.key)) {
			this.anims.create({
				key: animConfig.key,
				frames: this.anims.generateFrameNumbers(sprite.texture.key, { 
					start: animConfig.frameStart, 
					end: animConfig.frameEnd 
				}),
				frameRate: animConfig.frameRate,
				repeat: animConfig.repeat ?? -1
			});
		}
		
		// Play the animation
		sprite.play(animConfig.key);
	}
	private UI!: UI;
	private collisionIdleTimer?: Phaser.Time.TimerEvent;

	constructor() {
		super({ key: 'TownScene' });
	}

	init(config: GameSceneConfig): void {
		this.config = config || {};
	}

	create(): void {
		// Set current area in store
		store.dispatch(setCurrentArea("town"));
		
		const scene_padding = 40;
		this.global_game_width = Number(this.sys.game.config.width);
		this.global_game_height = Number(this.sys.game.config.height);
		this.zone = this.add.zone(scene_padding, scene_padding, this.global_game_width - (scene_padding*2), this.global_game_height - (scene_padding*2)).setOrigin(0);
		
		this.UI = new UI(this);

		this.input.on('pointerdown', (pointer: Input.Pointer, gameObject: GameObjects.GameObject[]) => {
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

		const character = this.config.type || store.getState().game.character;
		if (!character) throw new Error("No character selected for town scene");
		this.player = new AssignClass(character, {
			scene: this,
			x: 90,
			y: 220
		}) as PlayerType;

		// Create town map first to set up world bounds
		this.createTownEnvironment();

		if (this.input.mouse) {
			(this.input.mouse as Input.Mouse.MouseManager & { capture: boolean }).capture = true;
		}
		if (this.input.keyboard) {
			this.cursors = this.input.keyboard.createCursorKeys();
			this.cursors.esc = this.input.keyboard.addKey(Input.Keyboard.KeyCodes.ESC);
		}

		this.setupCollisions();
		this.setupPOIInteractions();

		this.createTownUI();

		store.dispatch(toggleHUD(true));

		this.cameras.main.startFollow(this.player);
	}

	private createTownEnvironment(): void {
		// Create tilemap from JSON file
		this.townMap = this.make.tilemap({ key: 'town-map' });
		
		// Add all tilesets used in the map (matching what's loaded in LoadScene)
		// The first parameter must match the tileset name in the .tmj file exactly
		// The second parameter must match the loaded image key from LoadScene
		const tilesets = {
			forestVillageObjects: this.townMap.addTilesetImage('forestVillageObjects_', 'forestVillageObjects'),
			forestPath: this.townMap.addTilesetImage('forestPath_', 'forestPath'),
			forestResources: this.townMap.addTilesetImage('forest_ [resources]', 'forestResources'),
			forestTerrain: this.townMap.addTilesetImage('forest_', 'forestTerrain'),
			forestStructures: this.townMap.addTilesetImage('forestVillageStructures_ [stallsWatchtower]', 'forestVillageStructures'),
			forestBridgeHorizontal: this.townMap.addTilesetImage('forest_ [bridgeHorizontal]', 'forestBridgeHorizontal'),
			forestBridgeVertical: this.townMap.addTilesetImage('forest_ [bridgeVertical]', 'forestBridgeVertical'),
			forestFencesAndWalls: this.townMap.addTilesetImage('forest_ [fencesAndWalls]', 'forestFencesAndWalls'),
			forestFountain: this.townMap.addTilesetImage('forest_ [fountain]', 'forestFountain'),
			home: this.townMap.addTilesetImage('greenHouse_0_0', 'home'),
			greathall: this.townMap.addTilesetImage('redHouse_3_0', 'greathall'),
			armory: this.townMap.addTilesetImage('forestVillage/stalls_/stall_blue_long.png', 'armory'),
			huntersLodge: this.townMap.addTilesetImage('forestVillage/stalls_/tower_green.png', 'huntersLodge'),
			alchemist: this.townMap.addTilesetImage('forestVillage/stalls_/stall_green_short.png', 'alchemist'),
			arcanum: this.townMap.addTilesetImage('forestVillage/stalls_/stall_red_short.png', 'arcanum'),
			wells: this.townMap.addTilesetImage('wells', 'wells'),
			furnace_lit: this.townMap.addTilesetImage('furnace_lit', 'furnace_lit'),
			container_stacks: this.townMap.addTilesetImage('forestVillageObjects_container_stacks', 'container_stacks'),
			stool: this.townMap.addTilesetImage('forestVillage/props_/forestVillageObjects_stool.png', 'stool'),
			signs: this.townMap.addTilesetImage('forest_resources_signs', 'signs'),
			containers: this.townMap.addTilesetImage('forestVillageObjects_containers', 'containers'),
			tableObjects: this.townMap.addTilesetImage('tableObjects_', 'tableObjects'),
			stallObjects: this.townMap.addTilesetImage('stallObjects_', 'stallObjects'),
			fire: this.townMap.addTilesetImage('fire', 'fire'),
			fountain_flowing: this.townMap.addTilesetImage('fountain_flowing', 'fountain_flowing'),
			stalls: this.townMap.addTilesetImage('stalls', 'stalls'),
			outdoor_tables: this.townMap.addTilesetImage('forestVillageObjects_outdoor_tables', 'outdoor_tables'),
			forest_trees: this.townMap.addTilesetImage('forest_resources_trees', 'forest_trees'),
			forest_bushes_rocks: this.townMap.addTilesetImage('forest_resources_bushes_rocks_ores', 'forest_bushes_rocks'),
			stash: this.townMap.addTilesetImage('stash', 'stash'),
			sign_post: this.townMap.addTilesetImage('fantasy/forest_/sign_post.png', 'sign_post'),
			bench: this.townMap.addTilesetImage('forestVillage/props_/forestVillageObjects_bench.png', 'bench'),
			table: this.townMap.addTilesetImage('forestVillage/props_/forestVillageObjects_table.png', 'table'),
			bench_long: this.townMap.addTilesetImage('forestVillage/props_/forestVillageObjects_bench_long.png', 'bench_long'),
			sign_post_flipped: this.townMap.addTilesetImage('fantasy/forest_/sign_post_flipped.png', 'sign_post_flipped'),
			boulder: this.townMap.addTilesetImage('fantasy/forest_/forest_resources_boulder.png', 'boulder'),
			arch: this.townMap.addTilesetImage('fantasy/forest_/forest_fencesAndWalls_arch.png', 'arch'),
			cloth_red: this.townMap.addTilesetImage('forestVillage/stalls_/cloth_red.png', 'cloth_red')
		};

		// Create layers in the correct order
		const allTilesets = Object.values(tilesets).filter(tileset => tileset !== null);

		const layerNames = [
			'terrain',
			'terrain floor',
			'terrain props',
			'terrain flairs', 
			'structure',
			'structure foreground',
			'flairs'
		];
		// Create and scale all layers (2x scaling)
		layerNames.forEach((layerName, index) => {
			const layer = this.townMap.createLayer(layerName, allTilesets);
			if (layer) {
				layer.setScale(2);
				if(layerName === 'structure foreground') this.setDepthByY(layer, this.global_game_height);
			}
		});
		
		// Create object layers for buildings and animated objects
		this.createObjectLayers();
		
		
		// Set world bounds to match scaled map size (2x larger)
		const originalMapWidth = this.townMap.widthInPixels;
		const originalMapHeight = this.townMap.heightInPixels;
		const mapWidth = originalMapWidth * 2;
		const mapHeight = originalMapHeight * 2;
				
		this.physics.world.setBounds(0, 0, mapWidth, mapHeight);
		
		// Update camera bounds to match world bounds
		this.cameras.main.setBounds(0, 0, mapWidth, mapHeight);
	}

	private createObjectLayers(): void {
		const layerNames = [
			'buildings',
			'props',
			'trees',
			'flairs',
			'stash',
			'fire',
			'fountain',
			'furnace'
		];

		layerNames.forEach(layerName => {
			// Use Phaser's built-in createFromObjects method for buildings layer
			const sprites = this.townMap.createFromObjects(layerName, {});

			// Scale and configure building sprites
			sprites.forEach((gameObject) => {
				if (gameObject instanceof GameObjects.Sprite) {
					const sprite = gameObject as GameObjects.Sprite;
					sprite.setScale(2);
					sprite.setX(sprite.x * 2);
					sprite.setY(sprite.y * 2);
					this.setDepthByY(sprite);
					this.addAnimationsToSprite(sprite);
				}
			});
		});
	}
	
	private addAnimationsToSprite(sprite: GameObjects.Sprite): void {
		// Check the texture key to determine what animations to add
		const textureKey = sprite.texture.key;
		
		switch (textureKey) {
			case 'furnace_lit':
				this.createAnimationForSprite(sprite, {
					key: 'furnace-anim',
					frameStart: 0,
					frameEnd: 7,
					frameRate: 8
				});
				break;
				
			case 'fire':
				this.createAnimationForSprite(sprite, {
					key: 'fire-anim',
					frameStart: 0,
					frameEnd: 3,
					frameRate: 10
				});
				break;
				
			case 'fountain_flowing':
				this.createAnimationForSprite(sprite, {
					key: 'fountain-anim',
					frameStart: 0,
					frameEnd: 3,
					frameRate: 6
				});
				break;
		}
	}

	private setupCollisions(): void {
		// Set up collision with collision map object layer
		const collisionLayer = this.townMap.getObjectLayer('collision map');
		if (!collisionLayer) throw Error("Collision layer failed to load!")

		// Ensure player has physics body
		if (!this.player.body) {
			console.warn('Player physics body not ready, cannot set up collisions');
			return;
		}

		// Create collision bodies from object layer (scaled 2x to match map)
		collisionLayer.objects.forEach((obj: any, index: number) => {
			const scaledX = obj.x * 2;
			const scaledY = obj.y * 2;
			const scaledWidth = obj.width * 2;
			const scaledHeight = obj.height * 2;
			
			let collisionBody: GameObjects.GameObject;
			
			if (obj.ellipse) {
				// Handle ellipse collision objects
				const ellipse = this.add.ellipse(scaledX + scaledWidth/2, scaledY + scaledHeight/2, scaledWidth, scaledHeight);
				collisionBody = ellipse;
			} else {
				// Handle rectangle collision objects
				const rectangle = this.add.rectangle(scaledX + scaledWidth/2, scaledY + scaledHeight/2, scaledWidth, scaledHeight);
				collisionBody = rectangle;
			}
			
			// Enable physics and set as static body
			this.physics.add.existing(collisionBody, true);
			
			// Add collision detection - this will now properly block the player
			this.physics.add.collider(this.player, collisionBody, () => {
				// Debounced idle: only set to idle after 500ms of continuous collision
				this.handleCollisionIdle();
			});

		});
	}

	private handleCollisionIdle(): void {
		// Clear existing timer if it exists
		if (this.collisionIdleTimer) {
			this.collisionIdleTimer.destroy();
		}

		// Set new timer for 500ms delay
		this.collisionIdleTimer = this.time.delayedCall(500, () => {
			if (this.player && this.player.body && this.player.body.speed < 20) {
				this.player.idle();
			}
			this.collisionIdleTimer = undefined;
		});
	}

	private setupPOIInteractions(): void {
		// Set up interaction zones from POI layer
		const poiLayer = this.townMap.getObjectLayer('POI');
		if (!poiLayer) {
			console.warn('No POI layer found in town map');
			return;
		}

		this.interactionZones = this.add.group();
		
		poiLayer.objects.forEach((poi: any) => {
			// Create interaction zone around each POI (scaled 2x to match map)
			const scaledX = poi.x * 2;
			const scaledY = poi.y * 2;
			const zone = this.add.zone(scaledX, scaledY, 32, 32); // 64x64 pixel interaction area (2x scaled)
			this.physics.world.enable(zone);

			this.player.body.onOverlap = true;
			// Map POI names to interaction types
			const { interactionType, displayName } = this.mapPOIToInteraction(poi.name);
			
			zone.setData('type', interactionType);
			zone.setData('name', displayName);
			zone.setData('poi', poi.name);
			this.interactionZones.add(zone);
			
			// Add overlap detection
			this.physics.add.overlap(this.player.body, zone as GameObjects.Zone, (player, zoneObj) => {
				this.handleZoneOverlap(player, zoneObj as GameObjects.Zone);
			});
		});
	}

	private mapPOIToInteraction(poiName: string): { interactionType: string; displayName: string } {
		switch (poiName) {
			case 'home':
				return { interactionType: 'inn', displayName: 'Home' };
			case 'stash':
				return { interactionType: 'storage', displayName: 'Storage' };
			case 'greathall':
				return { interactionType: 'inn', displayName: 'Great Hall' };
			case 'armory':
				return { interactionType: 'shop', displayName: 'Armory' };
			case 'alchemist':
				return { interactionType: 'shop', displayName: 'Alchemist' };
			case 'arcanum':
				return { interactionType: 'shop', displayName: 'Arcanum' };
			case 'merchant':
				return { interactionType: 'shop', displayName: 'Merchant' };
			case 'blacksmith':
				return { interactionType: 'shop', displayName: 'Blacksmith' };
			case 'entrance':
				return { interactionType: 'dungeon', displayName: 'Enter Dungeon' };
			default:
				return { interactionType: 'unknown', displayName: poiName };
		}
	}

	private createTownUI(): void {
		// UI elements will be added later
	}

	private handleZoneOverlap(player: any, zone: GameObjects.Zone): void {
		const zoneType = zone.getData('type');
		const zoneName = zone.getData('name');
		this.handleInteraction(zoneType, zoneName);
	}

	private handleInteraction(type: string, name: string): void {
		// Save current position before leaving town
		store.dispatch(setPlayerPosition({ x: this.player.x, y: this.player.y }));

		this.shutdown();
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
		// Update player depth based on Y position for proper sprite layering
		this.setDepthByY(this.player, this.player.hero.getBounds().height);
	}

	shutdown(): void {
		// Clean up HUD subscriptions
		if (this.UI && this.UI.cleanup) {
			this.UI.cleanup();
		}
		
		// Clean up player subscriptions
		if (this.player && this.player.cleanup) {
			this.player.cleanup();
		}
		
		// Clean up input event listeners
		this.input.off('pointerdown');
		this.input.off('pointermove');
		this.input.off('pointerup');
		
		// Clean up collision timer if it exists
		if (this.collisionIdleTimer) {
			this.collisionIdleTimer.destroy();
			this.collisionIdleTimer = undefined;
		}
	}
}