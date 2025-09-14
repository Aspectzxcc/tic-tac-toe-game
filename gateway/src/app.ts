import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { join } from 'node:path';

const app = express();
const server = createServer(app);
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(join(process.cwd(), 'index.html'));
});

io.on('connection', (socket) => {
  console.log(socket.id, 'connected');
});

io.on('disconnect', (socket) => {
  console.log(socket.id, 'disconnected');
});

export default server;