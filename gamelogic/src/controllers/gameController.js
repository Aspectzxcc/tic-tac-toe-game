const {games} = require('../logic/board');

exports.createGame = (req, res) => {
  try{
    const {player1ID, player2ID,roomId} = req.body;
    if(!player1ID || !player2ID || !roomId) {
      return res.status(400).json({error: "Missing required fields"});
    }
    games.roomId = roomId;
    games.gameId = `game-${Math.random().toString(36).slice(2, 11)}`;
    games.gameState = {
      board: [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""]
      ],
      players: {player1ID: "X", player2ID: "O"},
      currentPlayer: player1ID,
      winner: null
    };
    res.status(201).json({gameId: games.gameId});
  } catch (error) {
    console.error("Error in createGame:", error);
    res.status(500).json({error: "Internal Server Error"});
  }
};

exports.calculateMove = (req,res) => {
  try {
     const {gameId} = req.params;
     const {move} = req.body;
     if(!move || move.row === undefined || move.col === undefined) {
       return res.status(400).json({error: "Invalid move data"});
     }
  } catch (error) {
    console.error("Error in calculateMove:", error);
    res.status(500).json({error: "Internal Server Error"});
  }
}
