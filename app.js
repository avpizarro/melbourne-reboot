// Use dotenv to access the environmental variables
require('dotenv').config();

// Import express and create an app instace
const express = require('express');
const app = express();

// Define a dynamic port
const port = process.env.PORT || 3000;

// Require the router object defined in api.js
const apiRouter = require('./api');

// Serve static files (e.g. HTML, CSS, JavaScript) from the "public" directory
app.use(express.static('public'));

// Define a route for the home page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Mount the API router so the front end can access the routes defined in api.js
app.use('/api', apiRouter);

// Start the server
app.listen(port, () => {
  console.log('Server is running on port 3000');
});