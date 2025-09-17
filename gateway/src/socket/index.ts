import { Server, Socket } from 'socket.io';
import { handleDisconnect } from './controller/disconnectController.js';
import { auth } from './middleware/auth.js';

export default function registerSocketHandlers(io: Server) {
  io.use(auth);
  io.on('connection', (socket: Socket) => {
    console.log(`${socket.data.user.username} connected`);
    socket.on('disconnect', () => handleDisconnect(io, socket));
  });
}