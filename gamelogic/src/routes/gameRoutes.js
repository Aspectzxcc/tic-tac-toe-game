const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');
const gameState = require('../logic/board');

router.post('/move', gameController.calculateMove);

router.get('/',(req, res) =>{
  res.send(gameState)
})


module.exports = router;