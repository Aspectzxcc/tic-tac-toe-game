import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { join } from 'node:path';
import registerSocketHandlers from './socket.ts';

const app = express();
const server = createServer(app);
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(join(process.cwd(), 'index.html'));
});

registerSocketHandlers(io);

export default server;