import Phaser from "phaser";
import LoadScene from '@scenes/LoadScene';
import SelectScene from '@scenes/SelectScene';
import GameScene from '@scenes/GameScene';
import GameOverScene from '@scenes/GameOverScene';

import * as React from "react";

export default function Game() {
	componentDidMount() {
		const config = {
			type: Phaser.AUTO,
			width: window.outerWidth,
			height: window.outerHeight,
			backgroundColor: '#6e9c48',
			parent: "phaser-game",
			physics: {
				default: 'arcade',
				arcade: {
					debug: true,
					gravity: { y: 0 }
				}
			},
			scene: [
				LoadScene,
				SelectScene,
				GameScene,
				GameOverScene
			],
			pixelArt: true,
			antialias: false,
			fullscreen: true,
		}

    	new Phaser.Game(config);
	}

	shouldComponentUpdate() {
		return false;
	}

	render() {
		return <div id="phaser-game" />;
	}
}
