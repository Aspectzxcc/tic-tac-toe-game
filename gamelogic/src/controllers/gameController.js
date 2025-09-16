const { games } = require("../logic/board");

exports.createGame = (req, res) => {
  try {
    const { player1ID, player2ID, roomId } = req.body;
    if (!player1ID || !player2ID || !roomId) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const gameId = `game-${Math.random().toString(36).slice(2, 11)}`;

    games[gameId] = {
      roomId,
      gameState: {
        board: [
          ["", "", ""],
          ["", "", ""],
          ["", "", ""],
        ],
        players: { [player1ID]: "X", [player2ID]: "O" },
        currentPlayer: player1ID,
        winner: null,
      },
    };

    res.status(201).json({ gameId });
  } catch (error) {
    console.error("Error in createGame:", error);
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

    if(games[gameId].gameState.board[move.row][move.col]){
      return res.status(400).json({ error: "Cell already occupied" });
    }

    if (games[gameId].gameState.currentPlayer !== playerID) {
      return res.status(400).json({ error: `It's not your turn. Current player: ${games[gameId].gameState.players[games[gameId].gameState.currentPlayer]}` });
    }

    // Update board state
    const playerSymbol = games[gameId].gameState.players[playerID];
    games[gameId].gameState.board[move.row][move.col] = playerSymbol;

    // Update current player
    const playerList = Object.keys(games[gameId].gameState.players);
    const nextPlayer = playerList.find(id => id !== games[gameId].gameState.currentPlayer);
    games[gameId].gameState.currentPlayer = nextPlayer;

   res.status(200).json({ gameState: games[gameId].gameState });

  } catch (error) {
    console.error("Error in calculateMove:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
