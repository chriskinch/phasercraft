import React from "react"
import Spell from "@atoms/Spell"
import { connect } from "react-redux"
import { primeSpell } from "@store/reducers/spellReducer"
import { v4 as uuid } from 'uuid';
import 'styled-components/macro'

const Spells = ({disabled, primeSpell, spells}) => {
    return (
        <div 
            css={`
                pointer-events: all;
            `}
        >
            { spells &&
                spells.map(spell => <Spell 
                    spell={spell.name}
                    key={uuid()}
                    onClick={() => primeSpell(spell)}
                    disabled={disabled.includes(spell.name)}
                />)
            }
        </div>
    );
}

const mapStateToProps = (state) => {
    const { disabled } = state.spell;
    const { spells } = state.game;
    return { disabled, spells }
};

export default connect(mapStateToProps, { primeSpell })(Spells);