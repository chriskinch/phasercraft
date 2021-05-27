const { gql } = require('apollo-server');


const typeDefs = gql`
    type Query {
        items(filter: ItemFilters, orderBy: ItemInputs): [Item!]!
        item(id: ID!): Item!
    }

    type Mutation {
        postItem(
            name: String,
            category: String,
            icon: String,
            quality: String,
            stats: [StatInput]
        ): Item

        removeItem(
            id: ID!
        ): Item!

        clearStore: String!

        stockStore(
            amount: Int
        ): [Item!]!

        restockStore(
            amount: Int
        ): [Item!]!
    }

    type Item {
        id: ID!
        name: String!
        category: String!
        set: String!
        icon: String!
        quality: String!
        qualitySort: Int
        cost: Int!
        pool: Int!
        stats: [Stat!]!
    }

    type Stat {
        id: ID!
        name: String!
        value: Int!
    }
    
    input StatInput {
        name: String
        value: Int
    }

    
    input ItemInputs {
        quality: Sort
        pool: Sort
    }

    input ItemFilters {
        isInInventory: Boolean
        stats: [String]
    }
      
    enum Sort {
        asc
        desc
    }
`;


module.exports = typeDefs;