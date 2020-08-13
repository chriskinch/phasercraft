import React, { useEffect } from "react"
import Spell from "@atoms/Spell"
import { connect } from "react-redux"
import { primeSpell } from "@store/reducers/spellReducer"
import { v4 as uuid } from 'uuid';
import 'styled-components/macro'

const Spells = ({primeSpell, list}) => {

        // Similar to componentDidMount and componentDidUpdate:
    useEffect(() => {
        console.log("SPELLS: ", list)
        // console.log("COOLDOWN: ", cooldown, countDown)
    }, []);

    return (
        <div 
            css={`
                pointer-events: all;
            `}
        >
            { list &&
                Object.keys(list).map(spell => {
                    const { cooldown, disabled, primed } = list[spell];
                    return <Spell 
                        spell={spell}
                        key={uuid()}
                        onClick={() => primeSpell(spell)}
                        disabled={disabled}
                        primed={primed}
                        cooldown={cooldown}
                    />
                })
            }
        </div>
    );
}

const mapStateToProps = (state) => {
    const { list } = state.spell;
    return { list }
};

export default connect(mapStateToProps, { primeSpell })(Spells);