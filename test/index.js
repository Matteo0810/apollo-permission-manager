const express = require("express");
const http = require("http");
const cors = require("cors");
const {default: mongoose} = require("mongoose");

const { expressMiddleware } = require("@apollo/server/express4");
const { ApolloServerPluginDrainHttpServer } = require("@apollo/server/plugin/drainHttpServer");
const { ApolloServer } = require("@apollo/server");
const { makeExecutableSchema } = require("@graphql-tools/schema");

const { typeDefs, resolvers } = require("./schema");
const { applyPermissionsDirective, PermissionManager, loadPolicies } = require("../lib");

const users = require("./database/users.json");
const databases = require("./services/databases");

const app = express();
const httpServer = http.createServer(app);

new Promise(async resolve => {

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        schema: applyPermissionsDirective(makeExecutableSchema({ typeDefs, resolvers })),
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
    });
    await server.start();

    await databases.mongoose.connect();

    loadPolicies("test/policies");

    app.use("/graphql", cors(), express.json({ limit: '50mb' }),
        expressMiddleware(server, {
          context: async () => {
            // we imagined here that we already decoded the token and get the associated user 
            const user = users.find(({id}) => id === 1);

            return {
                permission: new PermissionManager({
                    me: user,
                    dataSource: {
                        name: "MONGOOSE",
                        instance: mongoose
                    }
                })
            }
          }
        })
    );

    const port = 8080;
    httpServer.listen({ port });
    resolve(port);
}).then(port => console.log(`🚀  Server ready at http://localhost:${port}/graphql`))