const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const routes = require('./routes/index');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/tic-tac-toe").then(() => {
  console.log('Connected to database');
})
// Middleware
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

//routes
app.use('/api', routes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

module.exports = app;

// To run the server, create a separate file (e.g., server.js) with the following content: