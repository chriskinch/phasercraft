import React from "react"
import { useSelector } from "react-redux"
import StatBar from "@components/StatBar"

const HUD = () => {
    const level = useSelector(state => state.game.level);

    return (
        <div className="hud-container">
            <div className="level-info">
                <label>LV {level?.currentLevel}</label>
                <StatBar colour={"#eee"} value={level.xpRemaining} max={level.toNextLevel} />
            </div>
            <style jsx>{`
                .hud-container {
                    padding: 0.5em 1em;
                }
                
                .level-info {
                    width: 100px;
                }
            `}</style>
        </div>
    );
}

export default HUD;