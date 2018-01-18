import express from 'express';
import bodyParser from 'body-parser';

import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { printSchema } from 'graphql/utilities/schemaPrinter';

import schema from './graphql';



// Initialize the app
const app = express();


// GraphQL endpoints
app.use('/graphql', bodyParser.json(), graphqlExpress({schema}));
app.use('/schema', (req, res) => res.type('text/plain').send(printSchema(schema)));
app.use('/graphiql', graphiqlExpress({endpointURL: '/graphql'}));


// Start the server
app.listen(3000, () => {
	console.log('Go to http://localhost:3000/graphiql to run queries!');
});
