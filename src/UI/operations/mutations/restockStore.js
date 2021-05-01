import { gql } from "@apollo/client"

export const RESTOCK_STORE = gql`
    mutation RestockStoreMutation($restockStoreAmount: Int) {
        restockStore(amount: $restockStoreAmount) {
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
            }
            color @client
            isInInventory @client
            isSelected @client
        }
    }
`;