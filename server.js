var express 		= require('express');
var graphqlHTTP 	= require('express-graphql');
var { buildSchema } = require('graphql');

var schema = buildSchema(`
	type Query {
		message: String
	}
`);

var root = { message: () => 'Anything else'};

var app = express();
app.use('/graphql', graphqlHTTP({
	schema: schema,
	rootValue: root,
	graphiql: true,
}));

app.listen(4000, () => console.log('Up in port 4000/graphql'));

