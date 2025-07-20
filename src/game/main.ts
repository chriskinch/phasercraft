
import { AUTO, Game } from 'phaser';
import LoadScene from '@scenes/LoadScene';
import SelectScene from '@scenes/SelectScene';
import GameScene from '@scenes/GameScene';
import GameOverScene from '@scenes/GameOverScene';

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: window.outerWidth,
    height: window.outerHeight,
    backgroundColor: '#6e9c48',
    parent: 'phaser-game',
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: { x: 0, y: 0 }
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
    // fullscreen: true,
};

const StartGame = (parent: string) => {
    
    return new Game({ ...config, parent });

}

export default StartGame;

