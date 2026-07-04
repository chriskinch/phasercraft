import { memo, useEffect, useRef } from "react";
import { Game, AUTO, Scale } from "phaser";
import BootScene from "@scenes/BootScene";
import LoadScene from "@scenes/LoadScene";
import SelectScene from "@scenes/SelectScene";
import TownScene from "@scenes/TownScene";
import GameScene from "@scenes/GameScene";
import GameOverScene from "@scenes/GameOverScene";

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
            gameContainer.innerHTML = "";
        }

        const config = {
            type: AUTO,
            backgroundColor: "#6e9c48",
            // Size to the real layout viewport and track resizes. RESIZE keeps the
            // canvas matched to the window (and the safe-area-padded #phaser-game
            // box) so an installed, landscape standalone PWA fills the screen
            // correctly — unlike the old outerWidth/outerHeight + fullscreen flag,
            // which mis-measured in standalone mode. Scenes read this.scale.width/
            // height, so full-window pixel coordinates still hold.
            scale: {
                mode: Scale.RESIZE,
                parent: "phaser-game",
                width: window.innerWidth,
                height: window.innerHeight,
            },
            physics: {
                default: "arcade",
                arcade: {
                    debug: true,
                    gravity: {
                        x: 0,
                        y: 0,
                    },
                },
            },
            scene: [BootScene, LoadScene, SelectScene, TownScene, GameScene, GameOverScene],
            pixelArt: true,
            antialias: false,
        };

        // The #phaser-game parent is rendered by this component and useEffect runs
        // after the DOM is committed, so the container already exists — create the
        // game synchronously rather than racing it behind a setTimeout.
        gameRef.current = new Game(config);

        // Cleanup function for when component unmounts or hot reloads
        return () => {
            if (gameRef.current) {
                console.log("Cleaning up Phaser game instance...");
                gameRef.current.destroy(true, false);
                gameRef.current = null;
            }
        };
    }, []);

    return <div id="phaser-game" />;
};

export default memo(PhaserGame);
