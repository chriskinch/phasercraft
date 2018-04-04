import 'phaser';
import GameScene from './Scenes/GameScene'

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
    	GameScene
    ],
    pixelArt: true,
    antialias: false
};

let game = new Phaser.Game(config);