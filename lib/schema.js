const { default: gql } = require("graphql-tag");

const schema = {
    typeDefs: gql`
        directive @requirePermission(
            ressource: String!,
            actions: [String!]!,
            throwError: Boolean = true
        ) on FIELD_DEFINITION

        extend type Query {
            hasPermission(uri: String!, actions: [String!]!): Boolean
        }
    `,
    resolvers: {
        hasPermission: async (_, {uri, actions}, {permission}) =>
            await permission.check(uri, actions, false)
    }
}

module.exports = schema;