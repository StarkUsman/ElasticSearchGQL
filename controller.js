const { createHandler } = require('graphql-http/lib/use/express');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');

// Create the executable schema
const schema = makeExecutableSchema({
    typeDefs,
    resolvers
});

// Define the GraphQL handler
const graphqlController = createHandler({
    schema,
    graphiql: true // Enable GraphiQL interface if needed
});

module.exports = graphqlController;