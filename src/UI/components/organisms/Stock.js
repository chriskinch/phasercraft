import React from "react"
import "styled-components/macro"
import Loot from "@molecules/Loot"
import { connect } from "react-redux"
import { selectLoot } from "@store/gameReducer"
import { useQuery, gql } from '@apollo/client';

const ITEMS = gql`
    query getItems {
        items {
            id
            name
            category
            set
            icon
            quality
            cost
            stats {
                id
                name
                value
            }
        }
    }
`;

export const qualityColors = Object.freeze({
    COMMON: "#bbbbbb",
    FINE: "#00dd00",
    RARE: "#0077ff",
    EPIC: "#9900ff",
    LEGENDARY: "#ff9900",
});

const Stock = ({cols=4, selected, selectLoot, loot}) => {
    const { loading, error, data } = useQuery(ITEMS);

    if(loading) return 'Loading...';

    if(error) return `ERROR: ${error.message}`;
    const lootn = data.items;
    const decorated = lootn.map(l => ({
        ...l,
        color: qualityColors[l.quality.toUpperCase()]
    }));

    // console.log("DATA:", decorated, loot)

    const items = [];
    for(const item of decorated){
        // Check for matching selected uuid
        const isSelected = selected ? selected.id === item.id : null;
        items.push(<Loot 
            loot={item}
            isSelected={isSelected}
            setSelected={() => { selectLoot(item) }}
            key={item.id}
        />);
    }

    return ( 
        <div 
            css={`
                display: grid;
                grid-template-columns: repeat(${cols}, 1fr);
                grid-gap: 0.5em;
                height: calc(100vh - 158px);
                overflow-y: scroll;
            `}
        >
            { data && items }
        </div>
    );
}

const mapStateToProps = (state) => {
    const { selected, loot } = state;
    return { selected, loot }
};

export default connect(mapStateToProps, {selectLoot})(Stock);