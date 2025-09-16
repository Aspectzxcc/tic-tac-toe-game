const express = require('express');
const app = express();
const routes = require('./routes/index');


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
app.use('/api', routes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

module.exports = app;

// To run the server, create a separate file (e.g., server.js) with the following content: