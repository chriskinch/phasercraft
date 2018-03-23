import 'phaser';
import GameScene from './Scenes/GameScene'


let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 }
        }
    },
    scene: [
    	GameScene
    ]
};

let game = new Phaser.Game(config);