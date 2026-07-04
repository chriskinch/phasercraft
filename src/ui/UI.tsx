import React, { createContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { pixelBackgroundVars } from "@ui/themes";
import theme from "@ui/themes.module.css";
import styles from "./UI.module.css";
import { toggleUi } from "@store/gameReducer";
import Arcanum from "@components/Arcanum";
import Armory from "@components/Armory";
import Character from "@components/Character";
import CharacterSelect from "@components/CharacterSelect";
import Equipment from "@components/Equipment";
import Header from "@components/Header";
import HUD from "@components/HUD";
import MainMenu from "@components/MainMenu";
import Save from "@components/Save";
import System from "@components/System";
import CustomDragLayer from "@components/CustomDragLayer";
import type { RootState } from "@store";

export const MenuContext = createContext<string>("character");

// The menu registry stores components with differing prop contracts and renders
// the active one by spreading its (optional) `props`. A common prop-erased
// component type lets the heterogeneous components share one registry entry.
type MenuComponent = React.ComponentType<Record<string, unknown>>;

interface MenuConfig {
    component: MenuComponent;
    title: string;
    navigation?: boolean;
    props?: Record<string, unknown>;
    close?: boolean;
    type?: string;
}

// The concrete components declare their own prop shapes; the registry treats
// them uniformly, so each is widened to the shared MenuComponent type.
const asMenuComponent = <P,>(component: React.ComponentType<P>): MenuComponent =>
    component as unknown as MenuComponent;

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
            component: asMenuComponent(Arcanum),
            title: "Arcanum",
            navigation: true,
        },
        armory: {
            component: asMenuComponent(Armory),
            title: "Armory",
            navigation: true,
        },
        character: {
            component: asMenuComponent(Character),
            title: "Character",
            navigation: true,
        },
        equipment: {
            component: asMenuComponent(Equipment),
            title: "Equipment",
            navigation: true,
        },
        load: {
            component: asMenuComponent(Save),
            title: "Load Game",
            props: { load: true },
            close: true,
        },
        menu: {
            component: asMenuComponent(MainMenu),
            title: "Main Menu",
        },
        save: {
            component: asMenuComponent(Save),
            title: "Pick a Game Save",
        },
        select: {
            component: asMenuComponent(CharacterSelect),
            title: "Character Select",
        },
        system: {
            component: asMenuComponent(System),
            title: "System",
            close: true,
        },
    };

    // Use specified menu other use equipment as default
    const CurrentMenu = menu ? config[menu] : config.equipment;
    const isSystem = menu === "system";

    return (
        <div className={styles.uiContainer}>
            {showHUD && <HUD />}
            {showUi && (
                <div className={styles.uiMain}>
                    <div className={styles.headerContainer}>
                        <Header config={CurrentMenu} toggleUi={handleToggleUi} />
                    </div>
                    <div
                        id={CurrentMenu.title.toLowerCase().replace(" ", "-")}
                        data-testid="menu-container"
                        className={isSystem ? undefined : theme.pixelBackground}
                        style={{
                            ...(isSystem ? {} : pixelBackgroundVars()),
                            margin: "0 auto",
                            padding: "calc(1em + 6px) 1em 1em",
                            width: isSystem ? "200px" : "100%",
                        }}
                    >
                        <CustomDragLayer />
                        <MenuContext.Provider value={menu || "equipment"}>
                            <CurrentMenu.component {...CurrentMenu.props} />
                        </MenuContext.Provider>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UI;
