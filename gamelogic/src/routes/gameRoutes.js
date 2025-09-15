const express = require('express');

const router = express.Router();

router.get('/',(req, res) =>{
  res.send("hello game routes")
})


module.exports = router;