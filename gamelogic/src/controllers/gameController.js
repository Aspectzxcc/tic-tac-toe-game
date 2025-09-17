const { games } = require("../data/games");
const notifyGateway = require("../client/gatewayClient");

exports.getGames = (req, res) => {
  try {
    res.status(200).json(games);
  } catch (error) {
    console.error("Error in getGames:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getGameById = (req, res) => {
  try {
    const { gameId } = req.params;
    if (!gameId || !games[gameId]) {
      return res.status(404).json({ error: "Game not found" });
    }
    res.status(200).json(games[gameId]);
  } catch (error) {
    console.error("Error in getGameById:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.createGame = (req, res) => {
  try {
    const { playerId, roomId } = req.body;
    if (!playerId || !roomId) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const gameId = roomId; // Use the roomId from the gateway as the gameId

    if (games[gameId]) {
      return res
        .status(409)
        .json({ error: "Game with this ID already exists." });
    }

    games[gameId] = {
      roomId,
      gameState: {
        board: [
          ["", "", ""],
          ["", "", ""],
          ["", "", ""],
        ],
        players: { [playerId]: "X" },
        currentPlayer: playerId,
        winner: null,
      },
    };

    notifyGateway("game:created", Object.values(games));

    res.status(201).json({ gameId });
  } catch (error) {
    console.error("Error in createGame:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.joinGame = (req, res) => {
  try {
    const { gameId } = req.params;
    const { playerId } = req.body;
    if (!gameId || !games[gameId]) {
      return res.status(404).json({ error: "Game not found" });
    }
    if (!playerId) {
      return res.status(400).json({ error: "Missing playerId" });
    }
    if (Object.keys(games[gameId].gameState.players).length >= 2) {
      return res.status(400).json({ error: "Game is already full" });
    }
    if (games[gameId].gameState.players[playerId]) {
      return res.status(400).json({ error: "Player already in the game" });
    }
    const symbol = Object.values(games[gameId].gameState.players).includes("X")
      ? "O"
      : "X";
    games[gameId].gameState.players[playerId] = symbol;

    notifyGateway("game:joined", Object.values(games));
    
    res.status(200).json({ gameState: games[gameId].gameState });
  } catch (error) {
    console.error("Error in joinGame:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.calculateMove = (req, res) => {
  try {
    const { gameId } = req.params;
    const { move, playerID } = req.body;

    // Input validation
    if (!gameId || !games[gameId]) {
      return res.status(400).json({ error: "Invalid or missing gameId" });
    }

    if (!move || move.row === undefined || move.col === undefined) {
      return res.status(400).json({ error: "Invalid move data" });
    }

    if (games[gameId].gameState.winner) {
      return res.status(400).json({ error: "Game already concluded" });
    }

    if (games[gameId].gameState.board[move.row][move.col]) {
      return res.status(400).json({ error: "Cell already occupied" });
    }

    if (games[gameId].gameState.currentPlayer !== playerID) {
      return res.status(400).json({
        error: `It's not your turn. Current player: ${
          games[gameId].gameState.players[games[gameId].gameState.currentPlayer]
        }`,
      });
    }

    // Update board state
    const playerSymbol = games[gameId].gameState.players[playerID];
    games[gameId].gameState.board[move.row][move.col] = playerSymbol;

    // Update current player
    const playerList = Object.keys(games[gameId].gameState.players);
    const nextPlayer = playerList.find(
      (id) => id !== games[gameId].gameState.currentPlayer
    );
    games[gameId].gameState.currentPlayer = nextPlayer;

    notifyGateway("game:moved", { gameId, gameState: games[gameId].gameState });

    res.status(200).json({ gameState: games[gameId].gameState });
  } catch (error) {
    console.error("Error in calculateMove:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.checkWinner = (req, res) => {
  try {
    const { gameId } = req.params;
    const game = games[gameId];
    const board = game.gameState.board;

    const winningCombinations = [
      // Rows
      [
        [0, 0],
        [0, 1],
        [0, 2],
      ],
      [
        [1, 0],
        [1, 1],
        [1, 2],
      ],
      [
        [2, 0],
        [2, 1],
        [2, 2],
      ],
      // Columns
      [
        [0, 0],
        [1, 0],
        [2, 0],
      ],
      [
        [0, 1],
        [1, 1],
        [2, 1],
      ],
      [
        [0, 2],
        [1, 2],
        [2, 2],
      ],
      // Diagonals
      [
        [0, 0],
        [1, 1],
        [2, 2],
      ],
      [
        [0, 2],
        [1, 1],
        [2, 0],
      ],
    ];

    for (const combination of winningCombinations) {
      const cell = combination[0];
      const symbol = board[cell[0]][cell[1]];

      const cellTwo = combination[1];
      const symbolTwo = board[cellTwo[0]][cellTwo[1]];

      const cellThree = combination[2];
      const symbolThree = board[cellThree[0]][cellThree[1]];

      if (symbol === symbolTwo && symbol === symbolThree && symbol !== "") {
        const winnerId = Object.keys(game.gameState.players).find(
          (id) => game.gameState.players[id] === symbol
        );
        game.gameState.winner = winnerId;

        return res.status(200).json({ winner: winnerId });
      }
    }

    const allCells = board.flat();
    const isTie = allCells.every((cell) => cell !== "");

    res.status(200).json({ winner: isTie ? "Tie" : null });
  } catch (error) {
    console.error("Error in checkWinner:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
