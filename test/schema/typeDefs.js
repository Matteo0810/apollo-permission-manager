const { default: gql } = require("graphql-tag");
const {permissionSchema} = require("../../lib");

module.exports = gql`

    ${permissionSchema.typeDefs}

    type Query {
        """
        Fetch user list from the database
        """
        fetchUsers: [User!] @requirePermission(ressource: "users", actions: ["list"])
    }

    type Mutation {
        """
        Add a new user in the database
        """
        addUser(user: UserInput!): User
    }

    input UserInput {
        username: String
        firstname: String
        lastname: String
        email: String
    }

    type User {
        id: ID!
        username: String
        firstname: String
        lastname: String
        email: String
    }

`;