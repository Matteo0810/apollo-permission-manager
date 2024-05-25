const { default: gql } = require("graphql-tag");

const schema = {
    typeDefs: gql`
        directive @requirePermission(
            ressourceName: String!,
            ressourceId: String!,
            actions: [String!]!,
            throwError: Boolean = true
        ) on FIELD_DEFINITION

        extend type Query {
            hasPermission(
                ressourceName: String!, 
                ressourceId: String!, 
                actions: [String!]!
            ): Boolean
        }
    `,
    resolvers: {
        hasPermission: async (_, {ressourceName, ressourceId, actions}, {permission}) =>
            await permission.check({name: ressourceName, id: ressourceId}, actions, false)
    }
}

module.exports = schema;