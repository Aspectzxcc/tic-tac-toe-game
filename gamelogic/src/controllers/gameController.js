games = {}

exports.getGames = (req, res) => {
  try {
    res.status(200).json(games);
  } catch (error) {
    console.error("Error in getGames:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

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
