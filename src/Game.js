import Phaser from "phaser";
// import ExampleScene from "./Scenes/ExampleScene";
import LoadScene from './Scenes/LoadScene';
import SelectScene from './Scenes/SelectScene';
import GameScene from './Scenes/GameScene';
import GameOverScene from './Scenes/GameOverScene';

import * as React from "react";

// import { GAME_HEIGHT, GAME_WIDTH } from "./config";

export default class Canvas extends React.Component {
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
					debug: false,
					gravity: { y: 0 }
				}
			},
			scene: [
				// ExampleScene
				LoadScene,
				SelectScene,
				GameScene,
				GameOverScene
			],
			// dom: {
			// 	createContainer: true
			// },
			pixelArt: true,
			antialias: false,
			fullscreen: true
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
