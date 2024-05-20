const { getRulesOf } = require("./policies");

module.exports = class PermissionManager {

    _me;

    constructor({ me }) {
        if(!me)
            throw new Error("me cannot be null or unedefined.");
        this._me = me;
    }

    check(ressource, actions, throwError = true) {
        const rules = getRulesOf(ressource);
        if(!rules)
            throw new Error(`No rules found for ressource '${ressource}'.`);
        // @todo replace mock results into real to call to a databse
        const mock = [
            { id: 1, roles: ["admin"], uri: "users:*" }
        ]


        console.log(JSON.stringify(rules, "", null));
    }

}