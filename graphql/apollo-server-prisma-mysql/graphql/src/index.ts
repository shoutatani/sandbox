import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./typeDefs.js";
import { resolvers } from "./resolvers.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export type MyContext = {
  db: typeof prisma;
};

const server = new ApolloServer<MyContext>({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async () => ({
    db: prisma,
  }),
});

console.log(`🚀  Server ready at: ${url}`);
