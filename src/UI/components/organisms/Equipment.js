import React from "react";
import { connect } from "react-redux";
import 'styled-components/macro';
import Inventory from "../molecules/Inventory";
import Slot from '../atoms/Slot';
import Stats from "../molecules/Stats";
import CustomDragLayer from "../protons/CustomDragLayer";

const Equipment = ({ character, stats }) => {
    return (
        <>
            <CustomDragLayer />
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
                <section css="width: 62px; margin: 0 2em;">
                    <Slot slot="helm" />
                    <Slot slot="body" />
                    <Slot slot="weapon" />
                    <Slot slot="amulet" />
                </section>
                <section css="flex-grow: 1; padding: 0 6px;">
                    <Inventory />
                </section>
            </div>
        </>
    );
}

const mapStateToProps = (state) => ({
    ...state
});

export default connect(mapStateToProps)(Equipment);