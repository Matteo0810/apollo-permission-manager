const { mapSchema, getDirective } = require("@graphql-tools/utils");
const PermissionManager = require("./PermissionManager");

function applyPermissionsDirective(schema) {
    return mapSchema(schema, {
        [MapperKind.OBJECT_FIELD]: fieldConfig => {
          const requirePermissionDirective = getDirective(schema, fieldConfig, "requirePermission")?.[0];
          if (requirePermissionDirective) {
            const { resolve } = fieldConfig;
            return {
              ...fieldConfig,
              resolve: async (source, args, context, info) => {
                const result = await resolve(source, args, context, info);

                // const permissionManager = new PermissionManager(context.me);
                // const {ressource, path, actions, throwError} = hasPermissionDirective;

                // // get ressource id from the given path
                // let ressourceId;
                // path.split(".").forEach(k => ressourceId = args[k]);
                // ressourceId ||= "*";

                // if(!await permissionManager.checkPermission(`${ressource}:${ressourceId}`, actions, throwError))
                //   return null;
                // return result;
              }
            }
          }
        }
    })
}

module.exports = { 
    PermissionManager, 
    applyPermissionsDirective,
    typeDefs: require("./typedefs"),
    resolvers: require("./resolvers")
};