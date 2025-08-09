import React, { createContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { pixel_background } from "@ui/themes";
import { toggleUi } from "@store/gameReducer";
import Arcanum from "@components/Arcanum";
import Armory from "@components/Armory";
import Character from "@components/Character";
import CharacterSelect from "@components/CharacterSelect";
import Equipment from "@components/Equipment";
import Header from "@components/Header";
import HUD from "@components/HUD";
import Save from "@components/Save";
import System from "@components/System";
import CustomDragLayer from "@components/CustomDragLayer";
import type { RootState } from "@store";

export const MenuContext = createContext<string>('character');

interface MenuConfig {
  component: React.ComponentType<any>;
  title: string;
  navigation?: boolean;
  props?: Record<string, unknown>;
  close?: boolean;
  type?: string;
}

const UI: React.FC = () => {
  const dispatch = useDispatch();
  const menu = useSelector((state: RootState) => state.game.menu);
  const showHUD = useSelector((state: RootState) => state.game.showHUD);
  const showUi = useSelector((state: RootState) => state.game.showUi);

  const handleToggleUi = () => {
    dispatch(toggleUi(menu));
  };

  const config: Record<string, MenuConfig> = {
    arcanum: {
      component: Arcanum,
      title: "Arcanum",
      navigation: true
    },
    armory: {
      component: Armory,
      title: "Armory",
      navigation: true
    },
    character: {
      component: Character,
      title: "Character",
      navigation: true
    },
    equipment: {
      component: Equipment,
      title: "Equipment",
      navigation: true
    },
    load: {
      component: Save,
      title: "Load Game",
      props: { load: true },
      close: true
    },
    save: {
      component: Save,
      title: "Pick a Game Save"
    },
    select: {
      component: CharacterSelect,
      title: "Character Select"
    },
    system: {
      component: System,
      title: "System",
      close: true
    }
  };

  // Use specified menu other use equipment as default
  const CurrentMenu = menu ? config[menu] : config.equipment;

  return (
    <div className="ui-container">
      {showHUD &&
        <HUD />
      }
      {showUi &&
        <div className="ui-main">
          <div className="header-container">
            <Header config={CurrentMenu} toggleUi={handleToggleUi} />
          </div>
          <div
            id={CurrentMenu.title.toLowerCase().replace(" ", "-")}
            className="menu-container"
          >
            <CustomDragLayer />
            <MenuContext.Provider value={menu || 'equipment'}>
              <CurrentMenu.component {...CurrentMenu.props} />
            </MenuContext.Provider>
          </div>
        </div>
      }
      <style jsx>{`
        .ui-container {
          position: absolute;
          width: 100vw;
          height: 100vh;
          pointer-events: none;
        }
        
        .ui-main {
          box-sizing: border-box;
          height: 100%;
          padding: 1em;
          width: 100%;
          pointer-events: all;
          background: rgba(0,0,0,0.5);
          display: flex;
          flex-direction: column;
        }
        
        .header-container {
          margin-bottom: 14px;
        }
        
        .menu-container {
          ${menu === "system" ? '' : pixel_background()}
          margin: 0 auto;
          padding: calc(1em + 6px) 1em 1em;
          width: ${menu === "system" ? "200px" : "100%"};
        }
      `}</style>
    </div>
  );
};

export default UI;