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

  io.emit(event, data);

  // If the event is a game update, also update the online player list with their statuses
  if (event === 'games:updated') {
    broadcastOnlinePlayers(io);
  }

  res.status(200).json({ message: "Broadcast successful" });
};