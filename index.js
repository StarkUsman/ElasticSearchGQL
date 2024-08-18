var express = require('express');
const controller = require('./controller');

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Route for GraphQL
app.use('/graphql', controller);

// Start the HTTP server
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is running on http://127.0.0.1:${PORT}/graphql`);
});
