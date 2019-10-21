import React from "react";
import { connect } from "react-redux";
import 'styled-components/macro';
import Slot from '../atoms/Slot';
import Stats from "../molecules/Stats";

const Equipment = (props) => {
    const { character, stats } = props;
    return (
        <>
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
            <section>
                <Slot slot="Helm" />
                <Slot slot="Body" />
                <Slot slot="Weapon" />
                <Slot slot="Amulet" />
                <Slot slot="Ring" />
            </section>
        </>
    );
}

const mapStateToProps = (state) => ({
    ...state
});

export default connect(mapStateToProps)(Equipment);