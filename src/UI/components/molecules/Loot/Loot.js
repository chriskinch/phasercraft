import React from "react"
import PropTypes from 'prop-types';
import "styled-components/macro"
import LootIcon from "../../atoms/LootIcon"
import Tooltip from "../Tooltip"

const Loot = ({id, loot, isSelected, setSelected}) => {
    return (
        <>
            <Tooltip id={id} loot={loot} />
            <div className="loot-icon" data-tip data-for={id} onClick={ setSelected ? () => setSelected() : null }>
                <LootIcon {...loot} id={id} selected={isSelected} />
            </div>
        </>
    );
};

Loot.defaultProps = {
    id: "1",
    loot: {
        category: "staff",
        color: "#00dd00",
        cost: 0,
        icon: "staff_3",
        stats: {},
        uuid: 12345
    },
    isSelected: false
};

Loot.propTypes = {
    id: PropTypes.string,
    loot: PropTypes.shape({
        base: PropTypes.number,
        category: PropTypes.string.isRequired,
        color: PropTypes.string.isRequired,
        cost: PropTypes.number.isRequired,
        icon: PropTypes.string,
        info: PropTypes.object,
        keys: PropTypes.shape({
            min: PropTypes.number,
            max: PropTypes.number
        }),
        multiplier: PropTypes.number,
        quality: PropTypes.string,
        quality_sort: PropTypes.number,
        set: PropTypes.string,
        stat_pool: PropTypes.number,
        stats: PropTypes.object.isRequired,
        uuid: PropTypes.number.isRequired
    }).isRequired,
    isSelected: PropTypes.bool,
    setSelected: PropTypes.func
};

export default Loot;
