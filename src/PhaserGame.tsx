'use client'

import { memo, useEffect, useRef } from "react";
import { Game, AUTO } from 'phaser';
import LoadScene from '@scenes/LoadScene';
import SelectScene from '@scenes/SelectScene';
import GameScene from '@scenes/GameScene';
import GameOverScene from '@scenes/GameOverScene';

const PhaserGame = () => {
    const gameRef = useRef<Game | null>(null);

    useEffect(() => {
        if (gameRef.current) {
            console.warn("Phaser game instance already exists, skipping creation.");
            return;
        }

        const config = {
            type: AUTO,
            width: window.outerWidth,
            height: window.outerHeight,
            backgroundColor: '#6e9c48',
            parent: "phaser-game",
            physics: {
                default: 'arcade',
                arcade: {
                    debug: true,
                    gravity: { 
                        x: 0,
                        y: 0
                    }
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

        gameRef.current =  new Game(config);
    }, []);

    return <div id="phaser-game" />;
}

export default memo(PhaserGame);