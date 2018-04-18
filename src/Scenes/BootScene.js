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

		this.global_tick = 0.2;
		this.global_swing_speed = 1;
		this.global_attack_delay = 250;
	}

	preload(){
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