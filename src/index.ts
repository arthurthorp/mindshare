import "dotenv/config";
import "reflect-metadata";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import express from "express";
import { buildSchema } from "type-graphql";
import { AuthResolver } from "./resolvers/auth.resolver";
import { UserResolver } from "./resolvers/user.resolver";
import { buildContext } from "./graphql/context";
import { IdeaResolver } from "./resolvers/idea.resolver";

async function bootstrap() {
  const app = express();

  const schema = await buildSchema({
    resolvers: [AuthResolver, UserResolver, IdeaResolver],
    validate: false,
    emitSchemaFile: "./schema.gql",
  });

  const server = new ApolloServer({
    schema,
  });

  await server.start();

  app.use(
    "/graphql",
    express.json(),
    expressMiddleware(server, {
      context: buildContext,
    }),
  );

  app.listen(4000, () => {
    console.log(`🚀 Server is running on http://localhost:4000/graphql`);
  });
}

bootstrap();
