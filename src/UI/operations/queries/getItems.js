import { gql } from "@apollo/client"

export const GET_ITEMS = gql`
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
            color @client
            isInInventory @client
            isSelected @client
        }
    }
`;