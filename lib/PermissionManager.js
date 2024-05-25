const { GraphQLError } = require("graphql");
const { getRulesOf } = require("./policies");

const DATASOURCE = {
    MONGOOSE: require("./services/Mongoose")
}

module.exports = class PermissionManager {

    _me;
    _dataSource;

    constructor({ me, dataSource }) {
        if(!me)
            throw new Error("me cannot be null or undefined.");
        if(!me.id)
            throw new Error("Me just provide a key 'id' which is unique.")
        if(!dataSource || !dataSource.name || !dataSource.instance)
            throw new Error("dataSource must be provided with valid a name and an instance.");
        if(!Object.keys(DATASOURCE).includes(dataSource.name))
            throw new Error("dataSource name must be in this list: " + Object.keys(DATASOURCE).join(", "))
        this._me = me;
        this._dataSource = new DATASOURCE[dataSource.name](dataSource.instance)
    }

    check(ressource, actions, throwError = true) {
        const rules = getRulesOf(ressource.name, this._me);
        if(!rules)
            throw new Error(`No rules found for ressource '${ressource}'.`);

        const results = this._dataSource.find({ id: this._me.id, ressource });

        const permissions = actions.filter(action => {
            const roles = [...new Set(...results.map(({roles}) => roles)), "default"];
            const rule = rules.find(({actions, roles: rs}) => 
                actions.includes(action) &&
                rs.find(r1 => roles.includes(r1))
            );
            return rule?.effect === "ALLOW";
        });
        const hasPermission = permissions.length && permissions.every(action => actions.includes(action));

        if(!hasPermission && throwError)
            throw new GraphQLError("You are not authorized to perform this action.",  { 
                extensions: { 
                  code: "FORBIDDEN" 
                } 
            });
        return hasPermission;
    }

}