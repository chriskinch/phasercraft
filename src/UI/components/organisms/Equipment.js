import React from "react";
import { connect } from "react-redux";
import 'styled-components/macro';
import Inventory from "../molecules/Inventory";
import Slot from '../atoms/Slot';
import Stats from "../molecules/Stats";

const Equipment = (props) => {
    const { character, stats } = props;
    return (
        <div css={`
            display: flex;
        `}>
            <section>
                <h2>Level 1</h2>
                <img 
                    src={`UI/player/${character}.gif`}
                    alt="This is you!"
                    css={`
                        height: 3em;
                    `}
                />
                <Stats>
                    { stats }
                </Stats>
            </section>
            <section css="width: 62px; margin: 0 1em;">
                <Slot slot="Helm" />
                <Slot slot="Body" />
                <Slot slot="Weapon" />
                <Slot slot="Amulet" />
            </section>
            <section css="flex-grow: 1">
                <Inventory />
            </section>
        </div>
    );
}

const mapStateToProps = (state) => ({
    ...state
});

export default connect(mapStateToProps)(Equipment);