import React from "react"
import { connect } from "react-redux"
import { pixel_background } from "./themes"
import { toggleUi } from "@store/gameReducer"
import Arcanum from "@templates/Arcanum"
import Armory from "@templates/Armory"
import Character from "@templates/Character"
import Equipment from "@templates/Equipment"
import Header from "@organisms/Header"
import Save from "@templates/Save"
import System from "@templates/System"
import CustomDragLayer from "@protons/CustomDragLayer"
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
                            padding: 1em;
                            width: ${ menu === "system" ? "200px" : "100%"};
                        `}
                    >
                        <CustomDragLayer />
                        <CurrentMenu.component {...CurrentMenu.props} />
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