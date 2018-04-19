import 'phaser';
import BootScene from './Scenes/BootScene';
import LoadScene from './Scenes/LoadScene';
import GameScene from './Scenes/GameScene';
import GameOverScene from './Scenes/GameOverScene';

document.body.setAttribute("style", "margin:0;");

let config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: '#6e9c48',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }
        }
    },
    scene: [
        BootScene,
        LoadScene,
    	GameScene,
        GameOverScene
    ],
    pixelArt: true,
    antialias: false
};

let game = new Phaser.Game(config);