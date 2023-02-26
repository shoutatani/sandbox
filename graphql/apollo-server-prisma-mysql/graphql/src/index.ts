import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { typeDefs } from "./typeDefs.js";
import { resolvers } from "./resolvers.js";
import { Prisma, PrismaClient, User } from "@prisma/client";
import express from "express";
import http from "http";
import cors from "cors";
import bodyParser from "body-parser";
import { expressMiddleware } from "@apollo/server/express4";

const prisma = new PrismaClient();

export type MyContext = {
  db: typeof prisma;
  currentUser?: User;
};

const app = express();

const httpServer = http.createServer(app);

const server = new ApolloServer<MyContext>({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
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
