const { default: gql } = require("graphql-tag");

const schema = {
    typeDefs: gql`
        scalar Any
        directive @requirePermission(
            ressourceName: String!,
            ressourceId: String!,
            actions: [String!]!,
            throwError: Boolean = true
        ) on FIELD_DEFINITION

        extend type Query {
            """
            Check user's permission for one or more actions on a ressource name & id ("*" for all ids of the ressource)
            """
            hasPermission(
                ressourceName: String!, 
                ressourceId: String!, 
                actions: [String!]!
            ): Boolean
        }
        
        extend type Mutation {
            """
            Set roles to a ressource name and id for a user Id
            """
            setRoles(
                id: Any!
                ressourceName: String!
                ressourceId: String!,
                roles: [String!]!
            ): Boolean
        }
    `,
    resolvers: {
        Query: {
            hasPermission: async (_, {ressourceName, ressourceId, actions}, {permission}) =>
                await permission.check({name: ressourceName, id: ressourceId}, actions, false)
        },
        Mutation: {
            setRoles: async (_, {id, ressourceName, ressourceId, roles}, {permission}) =>
                await permission.setRole(id, {name: ressourceName, id: ressourceId}, roles),
        }
    }
}

module.exports = schema;