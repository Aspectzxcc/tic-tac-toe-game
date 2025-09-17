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

const corsOptions = {
  origin: "*", // 1. Explicitly enable all origins
  methods: "GET,POST,PUT,DELETE,OPTIONS", // 2. Allow all necessary methods
  allowedHeaders: "Origin,X-Requested-With,Content-Type,Accept,Authorization", // 3. Allow necessary headers
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

//routes
app.use('/api', routes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

module.exports = app;

// To run the server, create a separate file (e.g., server.js) with the following content: