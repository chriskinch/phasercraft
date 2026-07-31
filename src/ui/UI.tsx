import React, { createContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { pixelBackgroundVars } from "@ui/themes";
import theme from "@ui/themes.module.css";
import styles from "./UI.module.css";
import { switchUi, toggleUi } from "@store/gameReducer";
import Alchemist from "@components/Alchemist";
import Arcanum from "@components/Arcanum";
import Armory from "@components/Armory";
import BiomeSelect from "@components/BiomeSelect";
import Blacksmith from "@components/Blacksmith";
import ConfirmReturn from "@components/ConfirmReturn";
import Character from "@components/Character";
import CharacterSelect from "@components/CharacterSelect";
import Equipment from "@components/Equipment";
import Header from "@components/Header";
import HUD from "@components/HUD";
import InstallBanner from "@components/InstallBanner";
import MainMenu from "@components/MainMenu";
import Merchant from "@components/Merchant";
import Save from "@components/Save";
import Settings from "@components/Settings";
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
    // When set, the close button navigates back to the previous screen instead
    // of closing the whole overlay (e.g. Settings opened from the main menu).
    back?: boolean;
    type?: string;
}

// The concrete components declare their own prop shapes; the registry treats
// them uniformly, so each is widened to the shared MenuComponent type.
const asMenuComponent = <P,>(component: React.ComponentType<P>): MenuComponent =>
    component as unknown as MenuComponent;

const UI: React.FC = () => {
    const dispatch = useDispatch();
    const menu = useSelector((state: RootState) => state.game.menu);
    const previousMenu = useSelector((state: RootState) => state.game.previousMenu);
    const showHUD = useSelector((state: RootState) => state.game.showHUD);
    const showUi = useSelector((state: RootState) => state.game.showUi);

    const config: Record<string, MenuConfig> = {
        // Shops (Phase 13) are POI-only: opened from their town building, closed
        // with the X. `close: true` gives the framed container a title + close
        // button without the Navigation tab bar (which no longer lists shops).
        alchemist: {
            component: asMenuComponent(Alchemist),
            title: "Alchemist",
            close: true,
        },
        arcanum: {
            component: asMenuComponent(Arcanum),
            title: "Arcanum",
            close: true,
        },
        armory: {
            component: asMenuComponent(Armory),
            title: "Armory",
            close: true,
        },
        blacksmith: {
            component: asMenuComponent(Blacksmith),
            title: "Blacksmith",
            close: true,
        },
        merchant: {
            component: asMenuComponent(Merchant),
            title: "Merchant",
            close: true,
        },
        biomeSelect: {
            component: asMenuComponent(BiomeSelect),
            title: "Choose a Biome",
            // Cancellable: closing leaves the player standing in town.
            close: true,
        },
        confirmReturn: {
            component: asMenuComponent(ConfirmReturn),
            title: "Return to Town",
            close: true,
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
            close: true,
            back: true,
        },
        select: {
            component: asMenuComponent(CharacterSelect),
            title: "Character Select",
        },
        settings: {
            component: asMenuComponent(Settings),
            title: "Settings",
            close: true,
            back: true,
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
    // The title screen (#382) is not a menu: it drops the header chrome and the
    // framed pixel-background panel, filling the overlay as a plain full-screen
    // splash so the logo and actions stay centered and visible on mobile.
    const isTitle = menu === "menu";

    const containerClassName = isTitle
        ? styles.titleScreen
        : isSystem
          ? undefined
          : theme.pixelBackground;
    const containerStyle: React.CSSProperties | undefined = isTitle
        ? undefined
        : {
              ...(isSystem ? {} : pixelBackgroundVars()),
              margin: "0 auto",
              padding: "calc(1em + 6px) 1em 1em",
              width: isSystem ? "200px" : "100%",
          };

    // Screens flagged `back` return to the previous screen on close; everything
    // else closes the overlay entirely (the original behavior).
    const handleClose = () => {
        if (CurrentMenu.back) {
            dispatch(switchUi(previousMenu ?? "menu"));
        } else {
            dispatch(toggleUi(menu));
        }
    };

    return (
        <div className={styles.uiContainer}>
            {showHUD && <HUD />}
            <InstallBanner />
            {showUi && (
                <div className={styles.uiMain}>
                    {!isTitle && (
                        <div className={styles.headerContainer}>
                            <Header config={CurrentMenu} toggleUi={handleClose} />
                        </div>
                    )}
                    <div
                        id={CurrentMenu.title.toLowerCase().replace(" ", "-")}
                        data-testid="menu-container"
                        className={containerClassName}
                        style={containerStyle}
                    >
                        {!isTitle && <CustomDragLayer />}
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
