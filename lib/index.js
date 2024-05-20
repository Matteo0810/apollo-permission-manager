const PermissionManager = require("./PermissionManager");
const schema = require("./schema");
const {applyPermissionsDirective} = require("./permissionDirective");
const {loadPolicies} = require("./policies");

module.exports = { 
    applyPermissionsDirective,
    PermissionManager,
    loadPolicies,
    permissionSchema: schema
};