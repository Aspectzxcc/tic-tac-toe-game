const express = require('express');
const cors = require('cors');
const routes = require('./routes/index')

const app = express();

const corsOptions = {
  origin: "*", // 1. Explicitly enable all origins
  methods: "GET,POST,PUT,DELETE,OPTIONS", // 2. Allow all necessary methods
  allowedHeaders: "Origin,X-Requested-With,Content-Type,Accept,Authorization", // 3. Allow necessary headers
  optionsSuccessStatus: 200
};

app.options('*', cors(corsOptions)); // Preflight OPTIONS request handling

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', routes);


app.use('/',(req, res)=>{
  res.send("hello world")
})


module.exports = app;