const { default: gql } = require("graphql-tag");

const PERMISSION_DIRECTIVE = gql`
    directive @requirePermission(
        path: String!,
        ressource: String!, 
        actions: [String!]!,
        throwError: Boolean = true
    ) on FIELD_DEFINITION
`;

const CHECK_PERMISSION_QUERY = gql`
    checkPermission(uri: String!, actions: [String!]!)
`

module.exports = { PERMISSION_DIRECTIVE, CHECK_PERMISSION_QUERY };