import { gql } from "@apollo/client"

const REMOVE_ITEM = gql`
    mutation RemoveItem($removeItemId: ID!) {
        removeItem(id: $removeItemId) {
            name
        }
    }
`;

export default REMOVE_ITEM;