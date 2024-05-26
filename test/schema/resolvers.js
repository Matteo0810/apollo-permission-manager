const {permissionSchema} = require("../../lib");
const users = require("../database/users.json");

module.exports = {
    Query: {
        ...permissionSchema.resolvers.Query,
        fetchUsers: () => users
    },
    Mutation: {
        ...permissionSchema.resolvers.Mutation,
        addUser: (_, {user}) => {
            // @todo check permission

            // will ne be save in the file, it's just for the example
            users.push(user);
            return user;
        }
    }
}