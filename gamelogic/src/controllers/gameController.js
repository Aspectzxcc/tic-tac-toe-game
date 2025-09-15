const {games} = require('../logic/board');

exports.createGame = (req, res) => {
  try{
    const {player1ID, player2ID,roomId} = req.body;
    if(!player1ID || !player2ID || !roomId) {
      return res.status(400).send({error: "Missing required fields"});
    }
    games.roomId = roomId;
    
  } catch (error) {
    console.error("Error in createGame:", error);
    res.status(500).send({error: "Internal Server Error"});
  }
};

exports.calculateMove = (req,res) => {
  try {
     const {move} = req.body;
     if(!move || move.row === undefined || move.col === undefined) {
       return res.status(400).send({error: "Invalid move data"});
     }
  } catch (error) {
    console.error("Error in calculateMove:", error);
    res.status(500).send({error: "Internal Server Error"});
  } 
}
