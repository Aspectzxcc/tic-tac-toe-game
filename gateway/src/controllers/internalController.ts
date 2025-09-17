import { Request, Response } from "express";
import { io } from "../app.js";

export const broadcastEvent = (req: Request, res: Response) => {
  const { event, data } = req.body;
  const secret = req.headers["x-internal-secret"];

  if (secret !== "your-super-secret-key") {
    return res.status(401).send("Unauthorized");
  }

  if (!event || !data) {
    return res.status(400).send("Missing event or data");
  }

  console.log(`Received internal broadcast request. Event: ${event}`);

  io.emit(event, data);

  res.status(200).json({ message: "Broadcast successful" });
};
