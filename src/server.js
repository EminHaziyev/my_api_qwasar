import dotenv from 'dotenv';
dotenv.config();
import { graphqlHTTP } from "express-graphql";
import schema from "./graphql/schema.js";
import resolvers from "./graphql/resolvers.js";

import app from './startup/app.js';

const port = process.env.PORT || 3000;

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    rootValue: resolvers,
    graphiql: true
  })
);

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
  console.log(`Swagger docs at http://localhost:${port}/docs`);
});


