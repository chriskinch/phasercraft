import 'phaser';
import BootScene from './Scenes/BootScene';
import LoadScene from './Scenes/LoadScene';
import GameScene from './Scenes/GameScene';
import GameOverScene from './Scenes/GameOverScene';

document.body.setAttribute("style", "margin:0;");

class Game extends Phaser.Game {
	constructor() {
		super({
			type: Phaser.AUTO,
			parent: 'body',
			width: window.innerWidth,
			height: window.innerHeight,
			backgroundColor: '#6e9c48',
			physics: {
				default: 'arcade',
				arcade: {
					debug: false,
					gravity: { y: 0 }
				}
			},
			scene: [
				BootScene,
				LoadScene,
				GameScene,
				GameOverScene
			],
			dom: {
				createContainer: true
			},
			pixelArt: true,
			antialias: false,
			globalScale: 2
		});

		window.addEventListener('resize', this.resizeGame.bind(this));
	}

	resizeGame() {
		var width = window.innerWidth;
		var height = window.innerHeight;
		//Resize game
		this.resize(width, height);
		//Let all scenes know of our new size
		for(let sceneKey in this.scene.keys) {
			if(this.scene.keys[sceneKey].resize) {
				this.scene.keys[sceneKey].resize(width, height);
			}
		}
	}
}

new Game();

if ('serviceWorker' in navigator) {
	window.addEventListener('load', () => {
		navigator.serviceWorker.register('/service-worker.js').then(registration => {
			console.log('SW registered: ', registration);
		}).catch(registrationError => {
			console.log('SW registration failed: ', registrationError);
		});
	});
}