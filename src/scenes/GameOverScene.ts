import { Scene, GameObjects, Display } from 'phaser';
import { fontConfig } from "../config/fonts";

export default class GameOverScene extends Scene {
	private global_game_width: number;
	private global_game_height: number;
	private zone: Phaser.GameObjects.Zone;
	private game_over: Phaser.GameObjects.Container;

	constructor() {
		super({
			key: 'GameOverScene'
		});
	}

	create(): void {
		const scene_padding = 60;
		this.global_game_width = this.sys.game.config.width as number;
		this.global_game_height = this.sys.game.config.height as number;
		this.zone = this.add.zone(scene_padding, scene_padding, this.global_game_width - (scene_padding*2), this.global_game_height - (scene_padding*2)).setOrigin(0);

		this.game_over = this.add.container(0, 0);
		Display.Align.In.Center(this.game_over, this.zone);

		this.cache.bitmapFont.add('wayne-3d', GameObjects.RetroFont.Parse(this, fontConfig));
		this.game_over.add(this.add.bitmapText(0, 0, 'wayne-3d', 'GAME OVER').setOrigin(0.5));
		this.game_over.add(this.add.bitmapText(0, 40, 'wayne-3d', 'RESTART').setOrigin(0.5).setScale(0.5));
		(this.game_over as Phaser.GameObjects.Container & { button: Phaser.GameObjects.Image }).button = this.make.image({key:'blank-gif', x:0, y:60}).setScale(12, 4).setInteractive();
		(this.game_over as Phaser.GameObjects.Container & { button: Phaser.GameObjects.Image }).button.on('pointerup', this.restartGame, this);
		this.game_over.add((this.game_over as Phaser.GameObjects.Container & { button: Phaser.GameObjects.Image }).button);
	}

	restartGame(): void {
		this.scene.start('GameScene');
	}
}