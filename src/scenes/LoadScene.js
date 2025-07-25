import { Scene, GameObjects } from "phaser";
import createAnimations from '../config/animations';
import store from "@store";
import { toggleUi } from "@store/gameReducer";

export default class LoadScene extends Scene {
	constructor() {
		super({
			key: 'LoadScene'
		});
	}
	preload(){
		this.sys.game.font_config = {
			image: 'wayne-3d',
			width: 31,
			height: 32,
			chars: GameObjects.RetroFont.TEXT_SET1,
			charsPerRow: 10,
			spacing: { x: 1, y: 0 }
		};

		let progress = this.add.graphics();

		this.load.on('progress', function (value) {
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
		this.load.image('consecration', 'spritesheets/spells/consecration.png', { frameWidth: 200, frameHeight: 200 });
		// Maps
		this.load.image("tiles", "tilesets/tileset_organic_extruded.png");
		this.load.tilemapTiledJSON('map', 'tilesets/enchanted_forrest_map.json');
	}

	create(){
		createAnimations(this);
		store.dispatch(toggleUi("save"));
		this.scene.start('SelectScene');
		//console.log(localStorage.getItem('itemname','contents'));
	}
}