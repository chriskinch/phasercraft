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
    }

    type Item {
        id: ID!
        name: String!
        category: String!
        set: String!
        icon: String!
        quality: String!
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
    }
      
    enum Sort {
        asc
        desc
    }
`;


module.exports = typeDefs;