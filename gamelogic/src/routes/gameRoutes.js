const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');

router.get("/", gameController.getGames);

router.get("/:gameId", gameController.getGameById);

router.post('/', gameController.createGame);

router.post('/:gameId/move', gameController.calculateMove);

router.post('/:gameId/join', gameController.joinGame);

router.delete('/:gameId/leave', gameController.leaveGame);

router.post('/:gameId/check', gameController.checkWinner);

router.get('/',(req, res) =>{
  res.send(gameState)
})


module.exports = router;