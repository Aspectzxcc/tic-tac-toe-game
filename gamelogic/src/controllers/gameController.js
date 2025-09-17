const { games } = require("../data/games");
const notifyGateway = require("../client/gatewayClient");

// ... (checkWinner function and other exports remain the same) ...

const checkWinner = (board) => {
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

    notifyGateway([
      { event: "games:updated", data: Object.values(games) }
    ]);
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

    notifyGateway([
      { event: "games:updated", data: Object.values(games) },
      { event: "game:state_update", data: { ...game, allGames: Object.values(games) } }
    ]);

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

    if (!game) {
      return res.status(404).json({ error: "Game not found" });
    }
    if (!playerId || !game.gameState.players.some((p) => p.id === playerId)) {
      return res.status(400).json({ error: "Player not in this game" });
    }

    let events = [];

    // If the host leaves, the game is over.
    if (game.gameState.hostId === playerId) {
      delete games[gameId];
      events.push(
        { event: "games:updated", data: Object.values(games) },
        { event: "game:ended", data: { gameId, message: "Game ended as host left" } }
      );
      notifyGateway(events);
      return res.status(200).json({ message: "Game ended as host left" });
    } else {
      game.gameState.players = game.gameState.players.filter(
        (p) => p.id !== playerId
      );
      game.gameState.board = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""],
      ];
      game.gameState.winnerId = null;
      game.gameState.currentPlayerId = game.gameState.hostId;

      events.push(
        { event: "games:updated", data: Object.values(games) },
        { event: "game:state_update", data: game },
        { event: "game:player_left", data: { gameId, message: "A player has left, waiting for a new player to join." } }
      );
      notifyGateway(events);
      return res.status(200).json({ message: "Player left, room is now open." });
    }
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

    // Prevent moves until two players have joined
    if (game.gameState.players.length < 2) {
      return res
        .status(400)
        .json({ error: "Waiting for a second player to join." });
    }

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

    notifyGateway([
      { event: "game:state_update", data: game }
    ]);

    res.status(200).json(game);
  } catch (error) {
    console.error("Error in makeMove:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
