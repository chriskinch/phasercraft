import { Scene, GameObjects, Display } from 'phaser';

export default class GameOverScene extends Scene {
	constructor() {
		super({
			key: 'GameOverScene'
		});
	}

	create(){
		let scene_padding = 60;
		this.global_game_width = this.sys.game.config.width;
		this.global_game_height = this.sys.game.config.height;
		this.zone = this.add.zone(scene_padding, scene_padding, this.global_game_width - (scene_padding*2), this.global_game_height - (scene_padding*2)).setOrigin(0);

		this.game_over = this.add.container(0, 0);
		Display.Align.In.Center(this.game_over, this.zone);

		this.cache.bitmapFont.add('wayne-3d', GameObjects.RetroFont.Parse(this, this.sys.game.font_config));
		this.game_over.add(this.add.bitmapText(0, 0, 'wayne-3d', 'GAME OVER').setOrigin(0.5));
		this.game_over.add(this.add.bitmapText(0, 60, 'wayne-3d', 'RESTART').setOrigin(0.5));
		this.game_over.button = this.make.image({key:'blank-gif', x:0, y:60}).setScale(12, 4).setInteractive();
		this.game_over.button.on('pointerup', this.restartGame, this);
		this.game_over.add(this.game_over.button);
	}

	restartGame(){
		this.scene.start('GameScene');
	}
}