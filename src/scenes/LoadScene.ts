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
		this.load.image('armory', 'tilesets/forestVillage/stalls_/stall_blue_long.png');
		this.load.image('huntersLodge', 'tilesets/forestVillage/stalls_/tower_green.png');
		this.load.image('alchemist', 'tilesets/forestVillage/stalls_/stall_green_short.png');
		this.load.image('arcanum', 'tilesets/forestVillage/stalls_/stall_red_short.png');
		this.load.image('tableObjects', 'tilesets/forestVillage/interior_/tableObjects_.png');
		this.load.image('forestResources', 'tilesets/fantasy/forest_/forest_ [resources].png');
		this.load.image('stool', "tilesets/forestVillage/props_/forestVillageObjects_stool.png");
		this.load.image('outdoor_tables', 'tilesets/forestVillage/props_/forestVillageObjects_outdoor_tables.png');
		this.load.image('sign_post', 'tilesets/fantasy/forest_/sign_post.png');
		this.load.image('bench', 'tilesets/forestVillage/props_/forestVillageObjects_bench.png');
		this.load.image('table', 'tilesets/forestVillage/props_/forestVillageObjects_table.png');
		this.load.image('bench_long', 'tilesets/forestVillage/props_/forestVillageObjects_bench_long.png');
		this.load.image('sign_post_flipped', 'tilesets/fantasy/forest_/sign_post_flipped.png');
		this.load.image('boulder', 'tilesets/fantasy/forest_/forest_resources_boulder.png');
		this.load.image('arch', 'tilesets/fantasy/forest_/forest_fencesAndWalls_arch.png');
		this.load.image('cloth_red', 'tilesets/forestVillage/stalls_/cloth_red.png');

		// spritesheets
		this.load.spritesheet('home', 'tilesets/forestVillage/buildings_/greenHouse_0_0.png', {
			frameWidth: 96,
			frameHeight: 96,
			margin: 16,
			spacing: 0
		});
		this.load.spritesheet('greathall', 'tilesets/forestVillage/buildings_/redHouse_3_0.png', {
			frameWidth: 112,
			frameHeight: 112,
			margin: 16,
			spacing: 0
		});
		this.load.spritesheet('wells', 'tilesets/forestVillage/wells.png', {
			frameWidth: 32,
			frameHeight: 48,
			margin: 0,
			spacing: 0
		});
		this.load.spritesheet('furnace_lit', 'spritesheets/furnace_lit.png', {
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
		this.load.spritesheet('fountain_flowing', 'spritesheets/fountain_flowing.png', {
			frameWidth: 64,
			frameHeight: 80,
			margin: 0,
			spacing: 0
		});
		this.load.spritesheet('container_stacks', 'tilesets/forestVillage/props_/forestVillageObjects_container_stacks.png', {
			frameWidth: 32,
			frameHeight: 32,
			margin: 0,
			spacing: 0
		});
		this.load.spritesheet('signs', 'tilesets/fantasy/forest_/forest_resources_signs.png', {
			frameWidth: 16,
			frameHeight: 32,
			margin: 0,
			spacing: 0
		});
		this.load.spritesheet('containers', 'tilesets/forestVillage/props_/forestVillageObjects_containers.png', {
			frameWidth: 16,
			frameHeight: 32,
			margin: 0,
			spacing: 0
		});
		this.load.spritesheet('forest_bushes_rocks', 'tilesets/fantasy/forest_/forest_resources_bushes_rocks_ores.png', {
			frameWidth: 16,
			frameHeight: 16,
			margin: 0,
			spacing: 0
		});
		this.load.spritesheet('stash', 'tilesets/fantasy/forest_/stash.png', {
			frameWidth: 32,
			frameHeight: 32,
			margin: 0,
			spacing: 0
		});
		this.load.spritesheet('forest_trees', 'tilesets/fantasy/forest_/forest_resources_trees.png', {
			frameWidth: 16,
			frameHeight: 32,
			margin: 0,
			spacing: 0
		});
		this.load.spritesheet('stallObjects', 'tilesets/forestVillage/stallObjects_.png', {
			frameWidth: 16,
			frameHeight: 32,
			margin: 16,
			spacing: 0
		});
	}

	create(){
		createAnimations(this);
		store.dispatch(toggleUi("save"));
		this.scene.start('SelectScene');
		//console.log(localStorage.getItem('itemname','contents'));
	}

	shutdown(): void {
		// Clean up load event listeners
		this.load.off('progress');
		this.load.off('complete');
	}
}