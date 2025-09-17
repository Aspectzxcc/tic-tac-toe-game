const express = require("express");
const router = express.Router();
const gameController = require("../controllers/gameController");

router.get("/", gameController.getGames);

router.get("/:gameId", gameController.getGameById);

router.post("/", gameController.createGame);

router.post("/:gameId/move", gameController.makeMove);

router.post("/:gameId/join", gameController.joinGame);

router.post("/:gameId/leave", gameController.leaveGame);

router.post("/:gameId/reset", gameController.resetGame);

module.exports = router;