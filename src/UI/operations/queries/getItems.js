import { gql } from "@apollo/client"

export const GET_ITEMS = gql`
    query getItems($itemsOrderBy: ItemInputs) {
        items(orderBy: $itemsOrderBy) {
            id
            name
            category
            set
            icon
            quality
            qualitySort
            cost
            pool
            stats {
                id
                name
                value
                adjusted @client
                formatted @client
                abbreviation @client
            }
            color @client
        }
    }
`; 