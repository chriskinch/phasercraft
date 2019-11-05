import React from "react"
import { connect } from "react-redux"
import { pixel_background } from "./themes"
import { toggleUi } from "../store/gameReducer"
import Arcanum from "./components/templates/Arcanum"
import Armory from "./components/templates/Armory"
import Button from "./components/atoms/Button"
import Character from "./components/templates/Character"
import Equipment from "./components/templates/Equipment"
import Navigation from "./components/molecules/Navigation"
import Title from "./components/atoms/Title"
import CustomDragLayer from "./components/protons/CustomDragLayer"
import "styled-components/macro"

const UI = ({ menu, showUi, toggleUi }) => {
    const config = {
        character: {
            component: Character,
            title: "Character Select"
        },
        equipment: {
            component: Equipment,
            title: "Equipment"
        },
        armory: {
            component: Armory,
            title: "Armory"
        },
        arcanum: {
            component: Arcanum,
            title: "Arcanum"
        }
    };

    const MenuContents = menu ? config[menu].component : Equipment;

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
                        { menu !== "character" ?
                            <>
                            <Navigation />
                            <div css={`
                                float: right;
                            `}>
                                <Button text="X" onClick={ () => toggleUi() } type="square" />
                            </div>
                            </>
                        : <Title text={ config[menu].title } /> }
                    </div>
                    <div
                        id={ config[menu].title.toLowerCase().replace(" ", "-") }
                        css={`
                            ${ pixel_background() }
                            padding: 1em;
                        `}
                    >
                        <CustomDragLayer />
                        <MenuContents />
                    </div>
                </div>
            }
        </div>
    );
}

const mapStateToProps = (state) => ({
    ...state
});

export default connect(mapStateToProps, { toggleUi })(UI);