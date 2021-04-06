const { gql } = require('apollo-server');

const typeDefs = gql`
    type Query {
        items:[Item!]!
        item(id: ID!): Item!

    }

    type Mutation {
        removeItem(
            id: ID!
        ): Item!
    }

    type Item {
        id: ID!
        name: String!
        category: String!
        icon: String!
        quality: Quality!
        stats: [Stat!]!
    }

    type Quality {
        name: String!
        pool: Int!
    }

    type Stat {
        id: ID!
        name: String!
        value: Int!
    }
`;


module.exports = typeDefs;