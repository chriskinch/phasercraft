import { Scene, GameObjects } from "phaser";
import createAnimations from '../Config/animations';

export default class LoadScene extends Scene {
	preload(){
		this.sys.game.font_config = {
			image: 'wayne-3d',
			width: 31,
			height: 32,
			chars: GameObjects.RetroFont.TEXT_SET1,
			charsPerRow: 10,
			spacing: { x: 1, y: 0 }
		};

		let p = { h:4, w:100 };
		let progress = this.add.graphics();

		this.load.on('progress', function (value) {
			progress.clear();
			progress.fillStyle(0x3e6c18, 1);
			progress.fillRect((window.innerWidth/2) - (p.w/2), (window.innerHeight/2) - (p.h/2), p.w, p.h);
			progress.fillStyle(0x6efc48, 1);
			progress.fillRect((window.innerWidth/2) - (p.w/2), (window.innerHeight/2) - (p.h/2), p.w * value, p.h);
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
		this.load.atlas('dungeon', 'atlas/atlas-dungeon.png', 'atlas/atlas-dungeon.json');
		this.load.atlas('enemy', 'atlas/atlas-enemy.png', 'atlas/atlas-enemy.json');
		this.load.spritesheet('heal-effect', 'spritesheets/spells/heal.png', { frameWidth: 192, frameHeight: 192 });
		this.load.spritesheet('siphonsoul-effect', 'spritesheets/spells/heal.png', { frameWidth: 192, frameHeight: 192 });
		this.load.spritesheet('fireball-effect', 'spritesheets/spells/fireball.png', { frameWidth: 87, frameHeight: 87 });
		this.load.atlas('siphon-soul', 'atlas/spells/atlas-siphonsoul.png', 'atlas/spells/atlas-siphonsoul.json');
		this.load.spritesheet('smite-effect', 'spritesheets/spells/smite.gif', { frameWidth: 100, frameHeight: 129 });
		this.load.image('snare-trap', 'spritesheets/spells/snaretrap.gif');
		this.load.spritesheet('multishot-effect', 'spritesheets/swoosh.png', { frameWidth: 32, frameHeight: 32 });
		this.load.spritesheet('whirlwind-effect', 'spritesheets/spells/whirlwind.png', { frameWidth: 32, frameHeight: 32 });

		// UI elements
		this.load.html('character-select', './UII/character-select.html');
		this.load.html('menu', './UI/menu.html');
	}

	create(){
		createAnimations(this);
		this.scene.start('SelectScene');
	}
}