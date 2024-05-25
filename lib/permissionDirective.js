const { mapSchema, getDirective, MapperKind } = require("@graphql-tools/utils");
const {GraphQLError} = require("graphql/error");

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
                const { ressourceName, ressourceId, actions, throwError } = requirePermissionDirective;
                const ressource = { name: ressourceName };
                let id;

                for(const path of ressourceId.split("."))
                    id = args[path];

                if(!id)
                    throw new GraphQLError(`Cannot find value for ressourceId '${ressourceId}'`, {
                        extensions: { code: "BAD_USER_INPUT" }
                    })

                ressource.id = id;
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