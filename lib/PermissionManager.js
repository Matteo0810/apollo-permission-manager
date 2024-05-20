const { GraphQLError } = require("graphql");
const { getRulesOf } = require("./policies");

module.exports = class PermissionManager {

    _me;

    constructor({ me }) {
        if(!me)
            throw new Error("me cannot be null or unedefined.");
        this._me = me;
    }

    check(ressource, actions, throwError = true) {
        const rules = getRulesOf(ressource, this._me);
        if(!rules)
            throw new Error(`No rules found for ressource '${ressource}'.`);
        // @todo replace mock results into real to call to a databse
        const results = [
            { id: 1, roles: ["admin"], ressource: "users", id: "*" }
        ]

        const hasPermission = actions.every(action => {
            const roles = [...new Set(...results.map(({roles}) => roles)), "default"];
            const rule = rules.find(({actions, roles: rs}) => 
                actions.includes(action) && 
                rs.find(r1 => roles.includes(r1))
            );
            return rule?.effect === "ALLOW";
        });

        if(!hasPermission && throwError)
            throw new GraphQLError("You are not authorized to perform this action.",  { 
                extensions: { 
                  code: "FORBIDDEN" 
                } 
            });
        return hasPermission;
    }

}