const PermissionManager = require("./lib/PermissionManger.js");

function usePermissionManger(options) {
    const permissionManger = new PermissionManager(options);
    return (req, res, next) => {
        const token = req.headers.authorization || "";
        next();
    }
}

module.exports = { usePermissionManger };