const { games } = require("../data/games");
const notifyGateway = require("../client/gatewayClient");

const getWinningCombinations = () => [
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

const checkWinner = (board) => {
  for (const combination of getWinningCombinations()) {
    const [a, b, c] = combination;
    if (
      board[a[0]][a[1]] &&
      board[a[0]][a[1]] === board[b[0]][b[1]] &&
      board[a[0]][a[1]] === board[c[0]][c[1]]
    ) {
      return board[a[0]][a[1]]; // return 'X' or 'O'
    }
  }
  if (board.flat().every((cell) => cell)) {
    return "Tie";
  }
  return null;
};

exports.getGames = (req, res) => {
  try {
    res.status(200).json(Object.values(games));
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
    res.status(500).json({ error: "Internal Server aError" });
  }
};

exports.createGame = (req, res) => {
  try {
    const { hostId, hostUsername } = req.body;
    if (!hostId || !hostUsername) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const gameId = Math.random().toString(36).substring(2, 10);

    games[gameId] = {
      gameId,
      gameState: {
        board: [
          ["", "", ""],
          ["", "", ""],
          ["", "", ""],
        ],
        players: [{ id: hostId, username: hostUsername, symbol: "X" }],
        hostId: hostId,
        currentPlayerId: hostId,
        winnerId: null,
      },
    };

    notifyGateway("games:updated", Object.values(games));
    res.status(201).json(games[gameId]);
  } catch (error) {
    console.error("Error in createGame:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.joinGame = (req, res) => {
  try {
    const { gameId } = req.params;
    const { playerId, playerUsername } = req.body;
    const game = games[gameId];

    if (!game) return res.status(404).json({ error: "Game not found" });
    if (!playerId || !playerUsername)
      return res.status(400).json({ error: "Missing player details" });
    if (game.gameState.players.length >= 2)
      return res.status(400).json({ error: "Game is already full" });
    if (game.gameState.players.some((p) => p.id === playerId))
      return res.status(400).json({ error: "Player already in the game" });

    const symbol = game.gameState.players.some((p) => p.symbol === "X")
      ? "O"
      : "X";
    game.gameState.players.push({
      id: playerId,
      username: playerUsername,
      symbol,
    });

    notifyGateway("games:updated", Object.values(games));
    notifyGateway("game:state_update", game);

    res.status(200).json(game);
  } catch (error) {
    console.error("Error in joinGame:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.leaveGame = (req, res) => {
  try {
    const { gameId } = req.params;
    const { playerId } = req.body;
    const game = games[gameId];

    if (!game) return res.status(404).json({ error: "Game not found" });
    if (!playerId || !game.gameState.players.some((p) => p.id === playerId))
      return res.status(400).json({ error: "Player not in the game" });

    if (game.gameState.hostId === playerId) {
      delete games[gameId];
      notifyGateway("games:updated", Object.values(games));
      notifyGateway("game:ended", {
        gameId,
        message: "Game ended as host left",
      });
      return res.status(200).json({ message: "Game ended as host left" });
    }

    game.gameState.players = game.gameState.players.filter(
      (p) => p.id !== playerId
    );
    if (game.gameState.currentPlayerId === playerId) {
      game.gameState.currentPlayerId = game.gameState.players[0]?.id || null;
    }

    notifyGateway("games:updated", Object.values(games));
    notifyGateway("game:state_update", game);

    res.status(200).json({ message: "Player left the game" });
  } catch (error) {
    console.error("Error in leaveGame:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.makeMove = (req, res) => {
  try {
    const { gameId } = req.params;
    const { move, playerID } = req.body;
    const game = games[gameId];

    if (!game) return res.status(400).json({ error: "Invalid gameId" });
    if (!move || move.row === undefined || move.col === undefined)
      return res.status(400).json({ error: "Invalid move data" });
    if (game.gameState.winnerId)
      return res.status(400).json({ error: "Game already concluded" });
    if (game.gameState.board[move.row][move.col])
      return res.status(400).json({ error: "Cell already occupied" });
    if (game.gameState.currentPlayerId !== playerID)
      return res.status(400).json({ error: "It's not your turn." });

    const player = game.gameState.players.find((p) => p.id === playerID);
    if (!player)
      return res.status(400).json({ error: "Player not found in this game." });

    game.gameState.board[move.row][move.col] = player.symbol;

    const winnerSymbol = checkWinner(game.gameState.board);
    if (winnerSymbol) {
      if (winnerSymbol === "Tie") {
        game.gameState.winnerId = "Tie";
      } else {
        const winner = game.gameState.players.find(
          (p) => p.symbol === winnerSymbol
        );
        game.gameState.winnerId = winner ? winner.id : null;
      }
      game.gameState.currentPlayerId = null;
    } else {
      const nextPlayer = game.gameState.players.find((p) => p.id !== playerID);
      game.gameState.currentPlayerId = nextPlayer ? nextPlayer.id : null;
    }

    notifyGateway("game:state_update", game);

    res.status(200).json(game);
  } catch (error) {
    console.error("Error in makeMove:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
