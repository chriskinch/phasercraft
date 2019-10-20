import React from "react";
import { connect } from "react-redux";
import { pixel_background } from './themes';
import Character from "./components/organisms/Character";
import Equipment from "./components/organisms/Equipment";
import Title from "./components/atoms/Title";
import 'styled-components/macro';

const UI = ({ menu, showUi }) => {
    const config = {
        character: {
            component: Character,
            title: "Character Select"
        },
        equipment: {
            component: Equipment,
            title: "Equipment"
        }
    };

    const MenuContents = config[menu].component;

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
                        margin-right: 12px;
                    `}>
                        <Title text={ config[menu].title } />
                    </div>
                    <div
                        id={ config[menu].title.toLowerCase().replace(" ", "-") }
                        css={`
                            ${ pixel_background() }
                            padding: 1em;
                        `}
                    >
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

export default connect(mapStateToProps)(UI);