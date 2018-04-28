class GameOverScene extends Phaser.Scene {
	constructor() {
		super({
			key: 'GameOverScene'
		});
	}

	create(){
		// this.cache.bitmapFont.add('wayne-3d', Phaser.GameObjects.BitmapText.ParseRetroFont(this, this.sys.game.font_config));

		// let loading_text = this.add.bitmapText(window.innerWidth/2, window.innerHeight/2, 'wayne-3d', 'GAME OVER');
		// loading_text.setOrigin(0.5, 0.5);
		// loading_text.setScale(2);

		// let restart_text = this.add.bitmapText(window.innerWidth/2, window.innerHeight/2 + 60, 'wayne-3d', 'RESTART');
		// restart_text.setOrigin(0.5, 0.5);
		// restart_text.setScale(0.5);

		// let restart_button = this.make.image({key:'blank-gif', x:restart_text.x, y:restart_text.y}).setScale(13, 3).setInteractive();
		// restart_button.on('pointerup', () => this.restartGame());
	}

	restartGame(){
		this.scene.start('GameScene');
	}
}

export default GameOverScene;