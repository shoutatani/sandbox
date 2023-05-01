import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { typeDefs } from "./typeDefs.js";
import { resolvers } from "./resolvers.js";
import { PrismaClient, User } from "@prisma/client";
import express from "express";
import http from "http";
import cors from "cors";
import bodyParser from "body-parser";
import { expressMiddleware } from "@apollo/server/express4";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import { PubSub } from "graphql-subscriptions";

const prisma = new PrismaClient();

export type MyContext = {
  db: typeof prisma;
  currentUser?: User;
  pubsub: PubSub;
};

const app = express();

const httpServer = http.createServer(app);

const schema = makeExecutableSchema({ typeDefs, resolvers });

// Creating the WebSocket server
const wsServer = new WebSocketServer({
  // This is the `httpServer` we created in a previous step.
  server: httpServer,
  // Pass a different path here if app.use
  // serves expressMiddleware at a different path
  path: "/graphql",
});

const pubsub = new PubSub();
const getDynamicContext = async (ctx, _msg, _args) => {
  if (!ctx.connectionParams.authorization) {
    return { currentUser: null };
  }

  // ctx is the graphql-ws Context where connectionParams live
  const githubToken = ctx.connectionParams.authorization;
  const db = prisma;
  const currentUser = await db.user.findFirst({
    where: {
      githubToken,
    },
  });

  return { db, currentUser, pubsub };
};

// Hand in the schema we just created and have the
// WebSocketServer start listening.
const serverCleanup = useServer(
  {
    schema,
    context: async (ctx, msg, args) => {
      // You can define your own function for setting a dynamic context
      // or provide a static value
      return getDynamicContext(ctx, msg, args);
    },
  },
  wsServer
);

const server = new ApolloServer<MyContext>({
  schema,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    // Proper shutdown for the WebSocket server.
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
  ],
});

await server.start();

app.use(
  "/graphql",
  cors<cors.CorsRequest>(),
  bodyParser.json(),
  expressMiddleware(server, {
    context: async ({ req }) => {
      const db = prisma;
      const githubToken = req.headers.authorization;
      const currentUser = await db.user.findFirst({
        where: {
          githubToken,
        },
      });
      return {
        db,
        currentUser,
        pubsub,
      };
    },
  })
);

app.get("/", (_req, res) => {
  res.end("Welcome to the PhotoShare API");
});

await new Promise<void>((resolve) =>
  httpServer.listen({ port: 4000 }, resolve)
);
console.log(`🚀 Server ready at http://localhost:4000/`);
