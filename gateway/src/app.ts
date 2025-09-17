import express, { Request, Response } from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { join } from 'node:path';
import registerSocketHandlers from './socket/index.js';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// test UI
app.get('/', (req: Request, res: Response) => {
  res.sendFile(join(process.cwd(), 'index.html'));
});

registerSocketHandlers(io);

export default server;