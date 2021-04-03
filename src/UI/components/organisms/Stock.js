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
            icon
            quality {
                name
                pool
            }
            stats {
                id
                name
                value
            }
        }
    }
`;

const Stock = ({cols=4, selected, selectLoot, loot}) => {
    const { loading, error, data } = useQuery(ITEMS);

    if(loading) return 'Loading...';

    if(error) return `ERROR: ${error.message}`;

    console.log("DATA:", data)

    const items = [];
    for(const item of loot){
        // Check for matching selected uuid
        const isSelected = selected ? selected.uuid === item.uuid : null;
        items.push(<Loot 
            loot={item}
            isSelected={isSelected}
            setSelected={() => { selectLoot(item) }}
            key={item.uuid}
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
            { loot && items }
        </div>
    );
}

const mapStateToProps = (state) => {
    const { selected, loot } = state;
    return { selected, loot }
};

export default connect(mapStateToProps, {selectLoot})(Stock);