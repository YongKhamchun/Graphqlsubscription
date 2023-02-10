import express from 'express';
import { createServer } from 'http';
import { PubSub } from 'graphql-subscriptions';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { expressMiddleware } from "@apollo/server/express4"
import cors from 'cors';
import bodyParser from 'body-parser';
import { typeDefs } from './src/schema/type-defs';
import { resolvers } from './src/schema/resolvers';

// Asnychronous Anonymous Function
// Inside of server.ts -> await keyword

( async function () {
    // Server code in here!
    const app = express();
    const httpServer = createServer(app);


    const schema = makeExecutableSchema({typeDefs, resolvers});

    // ws Server
    const wsServer = new WebSocketServer({
        server: httpServer,
        path: "/graphql" // localhost:3000/graphql
    });

    const serverCleanup = useServer({ schema }, wsServer); // dispose

    // apollo server
    const server = new ApolloServer({
        schema,
        plugins: [
            ApolloServerPluginDrainHttpServer({ httpServer }),
            {
                async serverWillStart() {
                    return {
                        async drainServer() {
                            await serverCleanup.dispose();
                        }
                    }
                }
            }
        ]
    });

    // start our server
    await server.start();

    //cors<cors.CorsRequest>()
    // apply middlewares (cors, expressmiddlewares)
    app.use('/graphql', bodyParser.json(), expressMiddleware(server));

    // http server start
    httpServer.listen(4000, () => {
        console.log("Server running on http://localhost:" + "4000" + "/graphql");
    });

})();