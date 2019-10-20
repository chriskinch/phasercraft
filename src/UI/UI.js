import React from "react";
import { connect } from "react-redux";
import CharacterCard from "./CharacterCard";
import 'styled-components/macro';
import { pixel_background } from './themes';

// import { MENU_HEIGHT, MENU_WIDTH } from "../config";



function UI({ showUi }) {
    return (
        <div css={`
            position:absolute;
        `}>
            {showUi &&
                <div css={`
                    box-sizing: border-box;
                    height: 100%;
                    padding: 1em;
                    width: 100%;
                    background: #6e9c48;
                    display: flex;
                    flex-direction: column;
                `}>
                    <div css={`
                        margin-bottom: 14px;
                    `}>
                        <h1 css={ pixel_background() }>Character Select</h1>
                    </div>
                    <div
                        id="character-select"
                        css={`
                            ${ pixel_background() }
                            padding: 1em;
                            display: flex;
                            align-items: center;
                        `}>
                        <ol 
                            className="character-list"
                            css={`
                                display: flex;
                                list-style: none;
                                margin: 0;
                                padding: 0;
                            `}
                        >
                            <CharacterCard type="Cleric" />
                            <CharacterCard type="Mage" />
                            <CharacterCard type="Occultist" />
                            <CharacterCard type="Ranger" />
                            <CharacterCard type="Warrior" />
                        </ol>
                    </div>
                </div>
            }
        </div>
    );
}

const mapStateToProps = ({ showUi }) => ({
    showUi
});

export default connect(mapStateToProps)(UI);