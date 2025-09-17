'use client'

import { memo, useEffect, useRef } from "react";
import { Game, AUTO } from 'phaser';
import LoadScene from '@scenes/LoadScene';
import SelectScene from '@scenes/SelectScene';
import TownScene from '@scenes/TownScene';
import GameScene from '@scenes/GameScene';
import GameOverScene from '@scenes/GameOverScene';

const PhaserGame = () => {
    const gameRef = useRef<Game | null>(null);

    useEffect(() => {
        // Clean up any existing game instance first
        if (gameRef.current) {
            console.log("Destroying existing Phaser game instance for hot reload...");
            gameRef.current.destroy(true, false);
            gameRef.current = null;
        }

        // Clear the game container
        const gameContainer = document.getElementById("phaser-game");
        if (gameContainer) {
            gameContainer.innerHTML = '';
        }

        // Add a small delay to ensure DOM is ready
        const createGame = () => {
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
                    TownScene,
                    GameScene,
                    GameOverScene
                ],
                pixelArt: true,
                antialias: false,
                fullscreen: true,
            };

            gameRef.current = new Game(config);
        };

        // Use a timeout to ensure DOM is fully ready
        const timeoutId = setTimeout(createGame, 100);

        // Cleanup function for when component unmounts or hot reloads
        return () => {
            clearTimeout(timeoutId);
            if (gameRef.current) {
                console.log("Cleaning up Phaser game instance...");
                gameRef.current.destroy(true, false);
                gameRef.current = null;
            }
        };
    }, []);

    return <div id="phaser-game" />;
}

export default memo(PhaserGame);