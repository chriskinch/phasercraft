import 'phaser';
import GameScene from './Scenes/GameScene'


let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#6e9c48',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }
        }
    },
    scene: [
    	GameScene
    ]
};

let game = new Phaser.Game(config);