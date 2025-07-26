import React from "react";
import { useSelector } from "react-redux";
import StatBar from "@components/StatBar";
import type { RootState } from "@store";

interface Level {
  currentLevel: number;
  xpRemaining: number;
  toNextLevel: number;
}

const HUD: React.FC = () => {
  const level = useSelector((state: RootState) => state.game.level);

  return (
    <div className="hud-container">
      <div className="level-info">
        <label>LV {level?.currentLevel}</label>
        <StatBar type="experience" colour={"#eee"} value={level.xpRemaining} max={level.toNextLevel} />
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
};

export default HUD;