import PlayerSprite from '../Graphics/spritesheets/player.png';
import ResourceFrame from '../Graphics/images/resource-frame.png';
import AttackSwoosh from '../Graphics/spritesheets/swoosh.png';
import BlankGif from '../Graphics/images/debug-blank.gif';
import DungeonAtlas from '../Graphics/atlas/atlas-dungeon.png';
import DungeonJSON from '../Graphics/atlas/atlas-dungeon.json';
import EnemyAtlas from '../Graphics/atlas/atlas-enemy.png';
import EnemyJSON from '../Graphics/atlas/atlas-enemy.json';
import IconAtlas from '../Graphics/atlas/atlas-icons.png';
import IconJSON from '../Graphics/atlas/atlas-icons.json';
import HealEffect from '../Graphics/spritesheets/spells/heal.png';
import createAnimations from '../Config/animations';

class LoadScene extends Phaser.Scene {
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
			chars: Phaser.GameObjects.RetroFont.TEXT_SET1,
			charsPerRow: 10,
			spacing: { x: 1, y: 0 }
		};

		this.cache.bitmapFont.add('wayne-3d', Phaser.GameObjects.RetroFont.Parse(this, this.sys.game.font_config));
		let loading_text = this.add.bitmapText(window.innerWidth/2, window.innerHeight/2 - 20, 'wayne-3d', 'LOADING');
		loading_text.setOrigin(0.5, 0.5);
		loading_text.setScale(0.5);

		let p = { h:4, w:100 };
		let progress = this.add.graphics();

		this.load.on('progress', function (value) {
			progress.clear();
			progress.fillStyle(0x3e6c18, 1);
			progress.fillRect((window.innerWidth/2) - (p.w/2), (window.innerHeight/2) - (p.h/2), p.w, p.h);
			progress.fillStyle(0x6efc48, 1);
			progress.fillRect((window.innerWidth/2) - (p.w/2), (window.innerHeight/2) - (p.h/2), p.w * value, p.h);
		});

		this.load.on('complete', function () {
			progress.destroy();
		});

		this.load.image('resource-frame', ResourceFrame);
		this.load.spritesheet('player', PlayerSprite, { frameWidth: 24, frameHeight: 32 });
		this.load.image('blank-gif', BlankGif);
		this.load.spritesheet('attack-swoosh', AttackSwoosh, { frameWidth: 32, frameHeight: 32 });
		this.load.atlas('dungeon', DungeonAtlas, DungeonJSON);
		this.load.atlas('enemy', EnemyAtlas, EnemyJSON);
		this.load.atlas('icon', IconAtlas, IconJSON);
		this.load.spritesheet('heal-effect', HealEffect, { frameWidth: 192, frameHeight: 192 });


		//this.loadExtender();
	}

	create(){
		createAnimations(this);
		this.scene.start('GameScene');
	}

	loadExtender(){
		this.load.setPath('https://labs.phaser.io/assets/sprites/');

		this.load.image('128x128');
		this.load.image('128x128-v2');
		this.load.image('a');
		this.load.image('advanced_wars_land');
		this.load.image('advanced_wars_tank');
		this.load.image('amiga-cursor');
		this.load.image('aqua_ball');
		this.load.image('arrow');
		this.load.image('arrows');
		this.load.image('asteroids_ship');
		this.load.image('asteroids_ship_white');
		this.load.image('asuna_by_vali233');
		this.load.image('atari130xe');
		this.load.image('atari400');
		this.load.image('atari800');
		this.load.image('atari800xl');
		this.load.image('atari1200xl');
		this.load.image('b');
		this.load.image('baddie_cat_1');
		this.load.image('balls');
		this.load.image('beball1');
		this.load.image('bikkuriman');
		this.load.image('block');
		this.load.image('blue_ball');
		this.load.image('bluebar');
		this.load.image('bluemetal_32x32x4');
		this.load.image('bobs-by-cleathley');
		this.load.image('bsquadron1');
		this.load.image('bsquadron2');
		this.load.image('bsquadron3');
		this.load.image('budbrain_chick');
		this.load.image('bullet');
		this.load.image('bunny');
		this.load.image('cakewalk');
		this.load.image('car');
		this.load.image('carrot');
		this.load.image('centroid');
		this.load.image('chain');
		this.load.image('checkerboard');
		this.load.image('chick');
		this.load.image('chunk');
		this.load.image('clown');
		this.load.image('coin');
		this.load.image('cokecan');
		this.load.image('columns-blue');
		this.load.image('columns-orange');
		this.load.image('columns-red');
		this.load.image('copy-that-floppy');
		this.load.image('crate');
		this.load.image('crate32');
		this.load.image('cursor-rotate');
		this.load.image('darkwing_crazy');
		this.load.image('default');
		this.load.image('diamond');
		this.load.image('dragcircle');
		this.load.image('drawcursor');
		this.load.image('dude');
		this.load.image('eggplant');
		this.load.image('elephant');
		this.load.image('enemy-bullet');
		this.load.image('exocet_spaceman');
		this.load.image('explosion');
		this.load.image('eyes');
		this.load.image('firstaid');
		this.load.image('fish-136x80');
		this.load.image('flectrum');
		this.load.image('flectrum2');
		this.load.image('fork');
		this.load.image('fruitnveg32wh37');
		this.load.image('fruitnveg64wh37');
		this.load.image('fuji');
		this.load.image('gameboy_seize_color_40x60');
		this.load.image('gem');
		this.load.image('gem-blue-16x16x4');
		this.load.image('gem-green-16x16x4');
		this.load.image('gem-red-16x16x4');
		this.load.image('ghost');
		this.load.image('green_ball');
		this.load.image('healthbar');
		this.load.image('helix');
		this.load.image('hello');
		this.load.image('hotdog');
		this.load.image('humstar');
		this.load.image('ilkke');
		this.load.image('interference_ball_48x48');
		this.load.image('interference_tunnel');
		this.load.image('jets');
		this.load.image('kirito_by_vali233');
		this.load.image('lemming');
		this.load.image('longarrow');
		this.load.image('longarrow-down');
		this.load.image('longarrow-white');
		this.load.image('longarrow2');
		this.load.image('loop');
		this.load.image('maggot');
		this.load.image('magnify-glass-inside');
		this.load.image('magnify-glass-outside');
		this.load.image('mask1');
		this.load.image('mask2');
		this.load.image('master');
		this.load.image('melon');
		this.load.image('metalface78x92');
		this.load.image('metalslug_monster39x40');
		this.load.image('metalslug_mummy37x45');
		this.load.image('mine');
		this.load.image('mouse_jim_sachs');
		this.load.image('mushroom');
		this.load.image('mushroom2');
		this.load.image('onion');
		this.load.image('orange-cat1');
		this.load.image('orange-cat2');
		this.load.image('orb-blue');
		this.load.image('orb-green');
		this.load.image('orb-red');
		this.load.image('oz_pov_melting_disk');
		this.load.image('pacman_by_oz_28x28');
		this.load.image('palm-tree-left');
		this.load.image('palm-tree-right');
		this.load.image('pangball');
		this.load.image('parsec');
		this.load.image('particle1');
		this.load.image('pepper');
		this.load.image('phaser');
		this.load.image('phaser-dude');
		this.load.image('phaser-large');
		this.load.image('phaser-ship');
		this.load.image('phaser_tiny');
		this.load.image('phaser1');
		this.load.image('phaser2');
		this.load.image('pineapple');
		this.load.image('plane');
		this.load.image('platform');
		this.load.image('player');
		this.load.image('purple_ball');
		this.load.image('ra_dont_crack_under_pressure');
		this.load.image('rain');
		this.load.image('red_ball');
		this.load.image('rgblaser');
		this.load.image('saw');
		this.load.image('shinyball');
		this.load.image('ship');
		this.load.image('shmup-baddie');
		this.load.image('shmup-baddie-bullet');
		this.load.image('shmup-baddie2');
		this.load.image('shmup-baddie3');
		this.load.image('shmup-boom');
		this.load.image('shmup-bullet');
		this.load.image('shmup-ship');
		this.load.image('shmup-ship2');
		this.load.image('skull');
		this.load.image('slime');
		this.load.image('slimeeyes');
		this.load.image('snake');
		this.load.image('snowflake-pixel');
		this.load.image('snowflakes');
		this.load.image('snowflakes_large');
		this.load.image('sonic');
		this.load.image('sonic_havok_sanity');
		this.load.image('soundtracker');
		this.load.image('space-baddie');
		this.load.image('space-baddie-purple');
		this.load.image('spaceman');
		this.load.image('speakers');
		this.load.image('spikedball');
		this.load.image('spinObj_01');
		this.load.image('spinObj_02');
		this.load.image('spinObj_03');
		this.load.image('spinObj_04');
		this.load.image('spinObj_05');
		this.load.image('spinObj_06');
		this.load.image('spinObj_07');
		this.load.image('spinObj_08');
		this.load.image('splat');
		this.load.image('steelbox');
		this.load.image('stormlord-dragon96x64');
		this.load.image('strip1');
		this.load.image('strip2');
		this.load.image('tetrisblock1');
		this.load.image('tetrisblock2');
		this.load.image('tetrisblock3');
		this.load.image('thrust_ship');
		this.load.image('thrust_ship2');
		this.load.image('tinycar');
		this.load.image('tomato');
		this.load.image('treasure_trap');
		this.load.image('tree-european');
		this.load.image('ufo');
		this.load.image('ukko-fujilogy-texture-64x64');
		this.load.image('vu');
		this.load.image('wabbit');
		this.load.image('wasp');
		this.load.image('wizball');
		this.load.image('x2kship');
		this.load.image('xenon2_bomb');
		this.load.image('xenon2_ship');
		this.load.image('yellow_ball');
		this.load.image('zelda-hearts');
		this.load.image('zelda-life');
	}
}

export default LoadScene;