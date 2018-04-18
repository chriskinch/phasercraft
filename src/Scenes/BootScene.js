import PlayerSprite from '../Graphics/spritesheets/player.png';
import ResourceFrame from '../Graphics/images/resource-frame.png';
import AttackSwoosh from '../Graphics/spritesheets/swoosh.png';
import DungeonAtlas from '../Graphics/atlas/atlas-dungeon.png';
import DungeonJSON from '../Graphics/atlas/atlas-dungeon.json';
import EnemyAtlas from '../Graphics/atlas/atlas-enemy.png';
import EnemyJSON from '../Graphics/atlas/atlas-enemy.json';

class BootScene extends Phaser.Scene {
	constructor() {
		super({
			key: 'BootScene'
		});
	}

	preload(){
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

		this.load.spritesheet('player', PlayerSprite, { frameWidth: 24, frameHeight: 32 });
		this.load.image('resource-frame', ResourceFrame);
		this.load.spritesheet('attack-swoosh', AttackSwoosh, { frameWidth: 32, frameHeight: 32 });
		this.load.atlas('dungeon', DungeonAtlas, DungeonJSON);
		this.load.atlas('enemy', EnemyAtlas, EnemyJSON);
	}

	create(){
		this.scene.start('GameScene');
	}
}

export default BootScene;