import { Server, Socket } from 'socket.io';
import { handleDisconnect, handleReconnect } from './controller/disconnectController.js';
import { auth } from './middleware/auth.js';

export default function registerSocketHandlers(io: Server) {
  io.use(auth);
  io.on('connection', (socket: Socket) => {
    handleReconnect(socket); // Clear disconnect timeout if present
    console.log(`${socket.data.user.username} connected`);
    socket.on('disconnect', () => handleDisconnect(io, socket));
  });
}