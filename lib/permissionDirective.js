const { mapSchema, getDirective, MapperKind } = require("@graphql-tools/utils");

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
                const { ressource, actions, throwError } = requirePermissionDirective;
                if(!await context.permission.check(ressource, actions, throwError)) 
                  return null;
                return result;
              }
            }
          }
        }
    })
}

module.exports = {
    applyPermissionsDirective
}