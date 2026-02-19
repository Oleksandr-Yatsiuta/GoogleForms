import express from 'express';
import cors from 'cors';
import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';
import { typeDefs } from './src/schema/typeDefs';
import { resolvers } from './src/schema/resolvers';
import { store } from './src/data/store';
import { errorHandler, formatGraphQLError, HttpError } from './src/middleware/errorHandler';

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
    customFormatErrorFn: formatGraphQLError,
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

app.use((req, _res, next) => {
  next(new HttpError(`Route ${req.method} ${req.originalUrl} not found`, 404, 'NOT_FOUND'));
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});