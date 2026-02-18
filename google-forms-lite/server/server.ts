import express from 'express';
import cors from 'cors';
import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';
import { typeDefs } from './src/schema/typeDefs';
import { resolvers } from './src/schema/resolvers';
import { store } from './src/data/store';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const schema = buildSchema(typeDefs);
const rootValue = {
  ...resolvers.Query,
  ...resolvers.Mutation,
};

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    rootValue,
    graphiql: true,
  })
);

app.get('/debug', (req, res) => {
  const forms = store.getForms();
  const responsesByForm = forms.reduce((acc, form) => {
    acc[form.id] = store.getResponses(form.id);
    return acc;
  }, {} as Record<string, ReturnType<typeof store.getResponses>>);

  res.json({ forms, responses: responsesByForm });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});