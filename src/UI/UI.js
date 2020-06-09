import React, { createContext } from "react"
import { connect } from "react-redux"
import { pixel_background } from "./themes"
import { toggleUi } from "@store/gameReducer"
import Arcanum from "@templates/Arcanum"
import Armory from "@templates/Armory"
import Character from "@templates/Character"
import CharacterSelect from "@templates/CharacterSelect"
import Equipment from "@templates/Equipment"
import Header from "@organisms/Header"
import HUD from "@templates/HUD"
import Save from "@templates/Save"
import System from "@templates/System"
import CustomDragLayer from "@protons/CustomDragLayer"
import "styled-components/macro"

export const MenuContext = createContext('character');

const UI = ({ menu, showHUD, showUi, toggleUi }) => {
    const config = {
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
            props: {load: true},
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
        <div css={`
            position:absolute;
            width:100vw;
            height:100vh;
            pointer-events: none;
        `}>
            {showHUD &&
                <HUD />
            }
            {showUi &&
                <div css={`
                    box-sizing: border-box;
                    height: 100%;
                    padding: 1em;
                    width: "100%";
                    pointer-events: all;
                    background: rgba(0,0,0,0.5);
                    display: flex;
                    flex-direction: column;
                `}>
                    <div css={`
                        margin-bottom: 14px;
                    `}>
                        <Header config={CurrentMenu} toggleUi={toggleUi} type={CurrentMenu.type}/>
                    </div>
                    <div
                        id={ CurrentMenu.title.toLowerCase().replace(" ", "-") }
                        css={`
                            ${ menu === "system" ? null : pixel_background() }
                            margin: 0 auto;
                            padding: calc(1em + 6px) 1em 1em;
                            width: ${ menu === "system" ? "200px" : "100%"};
                        `}
                    >
                        <CustomDragLayer />
                        <MenuContext.Provider value={menu}>
                            <CurrentMenu.component {...CurrentMenu.props} />
                        </MenuContext.Provider>
                    </div>
                </div>
            }
        </div>
    );
}

const mapStateToProps = (state) => {
    const { menu, showUi, showHUD } = state;
    return { menu, showHUD, showUi }
};

export default connect(mapStateToProps, { toggleUi })(UI);