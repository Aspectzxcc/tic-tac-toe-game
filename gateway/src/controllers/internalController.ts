import { Request, Response } from "express";
import { io } from "../app.js";
import { broadcastOnlinePlayers } from "../socket/onlinePlayersManager.js";

export const broadcastEvent = (req: Request, res: Response) => {
  const { event, data } = req.body;
  const secret = req.headers["x-internal-secret"];

  if (secret !== "your-super-secret-key") {
    return res.status(401).send("Unauthorized");
  }

  if (!event) {
    return res.status(400).send("Missing event");
  }

  console.log(`Received internal broadcast request. Event: ${event}`);

  // For game-specific events, emit to a room with the gameId
  if (
    (event === "game:state_update" || event === "game:ended") &&
    data.gameId
  ) {
    io.to(data.gameId).emit(event, data);

    // Also broadcast the general list of games if the state changed
    if (event === "game:state_update") {
      io.emit("games:updated", data.allGames);
    }
  } else {
    // For general events, broadcast to everyone
    io.emit(event, data);
  }

  // If the event is a general game list update, also update the online player list with their statuses
  if (event === "games:updated") {
    broadcastOnlinePlayers(io);
  }

  res.status(200).json({ message: "Broadcast successful" });
};
