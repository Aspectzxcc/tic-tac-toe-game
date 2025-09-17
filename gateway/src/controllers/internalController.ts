import { Request, Response } from "express";
import { io } from "../app.js";
import { broadcastOnlinePlayers } from "../socket/onlinePlayersManager.js";

const eventHandlers: Record<string, (data: any) => void> = {
  "game:state_update": (data) => {
    if (data.gameId) io.to(data.gameId).emit("game:state_update", data);
  },
  "game:ended": (data) => {
    if (data.gameId) io.to(data.gameId).emit("game:ended", data);
  },
  "game:player_left": (data) => {
    if (data.gameId) io.to(data.gameId).emit("game:player_left", data);
  },
  "games:updated": (data) => {
    io.emit("games:updated", data);
    broadcastOnlinePlayers(io);
  },
};

export const broadcastEvent = (req: Request, res: Response) => {
  const { events } = req.body;
  const secret = req.headers["x-internal-secret"];

  if (secret !== "your-super-secret-key") {
    return res.status(401).send("Unauthorized");
  }

  if (!events || !Array.isArray(events)) {
    return res.status(400).send("Missing or invalid events array");
  }

  console.log(
    `Received internal broadcast request. Events: ${events
      .map((e: any) => e.event)
      .join(", ")}`
  );

  for (const { event, data } of events) {
    const handler = eventHandlers[event];
    if (handler) {
      handler(data);
    } else {
      io.emit(event, data);
    }
  }

  res.status(200).json({ message: "Broadcasted all events" });
};
