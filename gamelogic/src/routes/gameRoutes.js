const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');
const gameState = require('../logic/board');


router.post('/:gameId/move', gameController.calculateMove);

router.post('/create', gameController.createGame);

router.post('/:gameId/check', gameController.checkWinner);

router.get('/',(req, res) =>{
  res.send(gameState)
})


module.exports = router;