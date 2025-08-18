import { Scene, GameObjects } from "phaser";
import createAnimations from '../config/animations';
import store from "@store";
import { toggleUi } from "@store/gameReducer";
import { fontConfig } from '../config/fonts';

export default class LoadScene extends Scene {
	constructor() {
		super({
			key: 'LoadScene'
		});
	}
	preload(){

		let progress = this.add.graphics();

		this.load.on('progress', function (value: number) {
			progress.clear();
			progress.fillStyle(0x00ff00, 1);
			progress.fillRect(0, 0, window.outerWidth * value, 4);
		});

		this.load.on('complete', () => {
			progress.destroy();
		});

		this.load.setPath('graphics');
		// Game entities
		this.load.image('wayne-3d', 'fonts/wayne-3d.png');
		this.load.image('resource-frame', 'images/resource-frame.png');
		this.load.spritesheet('player', 'spritesheets/player/noob.gif', { frameWidth: 24, frameHeight: 32 });
		this.load.spritesheet('cleric', 'spritesheets/player/cleric.gif', { frameWidth: 24, frameHeight: 32 });
		this.load.spritesheet('mage', 'spritesheets/player/mage.gif', { frameWidth: 24, frameHeight: 32 });
		this.load.spritesheet('occultist', 'spritesheets/player/occultist.gif', { frameWidth: 24, frameHeight: 32 });
		this.load.spritesheet('ranger', 'spritesheets/player/ranger.gif', { frameWidth: 24, frameHeight: 32 });
		this.load.spritesheet('warrior', 'spritesheets/player/warrior.gif', { frameWidth: 24, frameHeight: 32 });
		this.load.image('blank-gif', 'images/blank.gif');
		this.load.spritesheet('attack-swoosh', 'spritesheets/swoosh.png', { frameWidth: 32, frameHeight: 32 });
		this.load.spritesheet('coin-spin', 'spritesheets/coin.png', { frameWidth: 16, frameHeight: 16 });
		this.load.spritesheet('gem-shine', 'spritesheets/gem.png', { frameWidth: 32, frameHeight: 28 });
		this.load.atlas('dungeon', 'atlas/atlas-dungeon.png', 'atlas/atlas-dungeon.json');
		this.load.atlas('enemy', 'atlas/atlas-enemy.png', 'atlas/atlas-enemy.json');
		this.load.atlas('icon', 'atlas/atlas-icons.png', 'atlas/atlas-icons.json');
		this.load.atlas('crafting', 'atlas/crafting.png', 'atlas/crafting.json');
		this.load.spritesheet('heal-effect', 'spritesheets/spells/heal.png', { frameWidth: 192, frameHeight: 192 });
		this.load.spritesheet('faith-effect', 'spritesheets/spells/heal.png', { frameWidth: 192, frameHeight: 192 });
		this.load.spritesheet('siphonsoul-effect', 'spritesheets/spells/heal.png', { frameWidth: 192, frameHeight: 192 });
		this.load.spritesheet('earthshield-effect', 'spritesheets/spells/earthshield.png', { frameWidth: 150, frameHeight: 105 });
		this.load.spritesheet('manashield-effect', 'spritesheets/spells/manashield.png', { frameWidth: 50, frameHeight: 50 });
		this.load.spritesheet('fireball-effect', 'spritesheets/spells/fireball.png', { frameWidth: 87, frameHeight: 87 });
		this.load.spritesheet('frostbolt-effect', 'spritesheets/spells/frostbolt.png', { frameWidth: 150, frameHeight: 67 });
		this.load.atlas('siphon-soul', 'atlas/spells/atlas-siphonsoul.png', 'atlas/spells/atlas-siphonsoul.json');
		this.load.spritesheet('smite-effect', 'spritesheets/spells/smite.gif', { frameWidth: 100, frameHeight: 129 });
		this.load.image('snare-trap', 'spritesheets/spells/snaretrap.gif');
		this.load.spritesheet('multishot-effect', 'spritesheets/swoosh.png', { frameWidth: 32, frameHeight: 32 });
		this.load.spritesheet('whirlwind-effect', 'spritesheets/spells/whirlwind.png', { frameWidth: 32, frameHeight: 32 });
		this.load.image('consecration', 'spritesheets/spells/consecration.png');
		// Maps
		this.load.image("tiles", "tilesets/tileset_organic_extruded.png");
		this.load.tilemapTiledJSON('map', 'tilesets/enchanted_forrest_map.json');
		
		// Town assets
		this.load.tilemapTiledJSON('town-map', 'tilesets/town-tiled-project.tmj');
		
		// Town tilesets (only the ones actually used in TMJ file)
		this.load.image('forestVillageStructures', 'tilesets/forestVillage/forestVillageStructures_ [stallsWatchtower].png');
		this.load.image('forestVillageObjects', 'tilesets/forestVillage/forestVillageObjects_.png');
		this.load.image('forestPath', 'tilesets/fantasy/forest_/forestPath_.png');
		this.load.image('forestBridgeHorizontal', 'tilesets/fantasy/forest_/forest_ [bridgeHorizontal].png');
		this.load.image('forestBridgeVertical', 'tilesets/fantasy/forest_/forest_ [bridgeVertical].png');
		this.load.image('forestFencesAndWalls', 'tilesets/fantasy/forest_/forest_ [fencesAndWalls].png');
		this.load.image('forestFountain', 'tilesets/fantasy/forest_/forest_ [fountain].png');
		this.load.image('forestTerrain', 'tilesets/fantasy/forest_/forest_.png');
		this.load.spritesheet('greenHouse0', 'tilesets/forestVillage/buildings_/greenHouse_0_0.png', {
			frameWidth: 96,
			frameHeight: 96,
			margin: 16,
			spacing: 0
		});
		this.load.spritesheet('redHouse3', 'tilesets/forestVillage/buildings_/redHouse_3_0.png', {
			frameWidth: 112,
			frameHeight: 112,
			margin: 16,
			spacing: 0
		});
		this.load.image('tableObjects', 'tilesets/forestVillage/interior_/tableObjects_.png');
		this.load.image('forestResources', 'tilesets/fantasy/forest_/forest_ [resources].png');
		this.load.image('stallObjects', 'tilesets/forestVillage/stallObjects_.png');
		this.load.spritesheet('furnace', 'spritesheets/furnace_lit.png', {
			frameWidth: 32,
			frameHeight: 48,
			margin: 0,
			spacing: 0
		});
		this.load.spritesheet('fire', 'spritesheets/fire.png', {
			frameWidth: 16,
			frameHeight: 32,
			margin: 0,
			spacing: 0
		});
		this.load.spritesheet('fountain', 'spritesheets/fountain_flowing.png', {
			frameWidth: 64,
			frameHeight: 80,
			margin: 0,
			spacing: 0
		});
	}

	create(){
		createAnimations(this);
		store.dispatch(toggleUi("save"));
		this.scene.start('SelectScene');
		//console.log(localStorage.getItem('itemname','contents'));
	}
}