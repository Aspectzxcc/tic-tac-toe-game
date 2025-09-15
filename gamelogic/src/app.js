const express = require('express');
const routes = require('./routes/index')

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', routes);


app.use('/',(req, res)=>{
  res.send("hello world")
})


module.exports = app;