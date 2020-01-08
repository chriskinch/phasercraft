import React from "react"
import { connect } from "react-redux"
import { pixel_background } from "./themes"
import { toggleUi } from "../store/gameReducer"
import Arcanum from "./components/templates/Arcanum"
import Armory from "./components/templates/Armory"
import Character from "./components/templates/Character"
import Equipment from "./components/templates/Equipment"
import Header from "./components/organisms/Header"
import Save from "./components/templates/Save"
import CustomDragLayer from "./components/protons/CustomDragLayer"
import "styled-components/macro"

const UI = ({ menu, showUi, toggleUi }) => {
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
            title: "Character Select"
        },
        equipment: {
            component: Equipment,
            title: "Equipment",
            navigation: true
        },
        save: {
            component: Save,
            title: "Load Game Save"
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
            {showUi &&
                <div css={`
                    box-sizing: border-box;
                    height: 100%;
                    padding: 1em;
                    width: 100%;
                    pointer-events: all;
                    background: rgba(0,0,0,0.5);
                    display: flex;
                    flex-direction: column;
                `}>
                    <div css={`
                        margin-bottom: 14px;
                    `}>
                        <Header config={CurrentMenu} toggleUi={toggleUi} />
                    </div>
                    <div
                        id={ CurrentMenu.title.toLowerCase().replace(" ", "-") }
                        css={`
                            ${ pixel_background() }
                            padding: 1em;
                        `}
                    >
                        <CustomDragLayer />
                        <CurrentMenu.component />
                    </div>
                </div>
            }
        </div>
    );
}

const mapStateToProps = (state) => {
    const { menu, showUi } = state;
    return { menu, showUi }
};

export default connect(mapStateToProps, { toggleUi })(UI);