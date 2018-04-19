class GameOverScene extends Phaser.Scene {
	constructor() {
		super({
			key: 'GameOverScene'
		});
	}

	create(){
		var font_config = {
			image: 'wayne-3d',
			width: 31,
			height: 32,
			chars: Phaser.GameObjects.BitmapText.ParseRetroFont.TEXT_SET2,
			charsPerRow: 10,
			spacing: { x: 1, y: 0 }
    };

    this.cache.bitmapFont.add('wayne-3d', Phaser.GameObjects.BitmapText.ParseRetroFont(this, font_config));
    let loading_text = this.add.bitmapText(window.innerWidth/2, window.innerHeight/2, 'wayne-3d', 'GAME OVER');
    loading_text.setOrigin(0.5, 0.5);
    loading_text.setScale(2);
	}
}

export default GameOverScene;