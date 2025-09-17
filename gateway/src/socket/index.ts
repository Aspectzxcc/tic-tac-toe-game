import { Server, Socket } from 'socket.io';
import { createRoom, joinRoom, leaveRoom } from './controller/roomController.js';
import { handleDisconnect } from './controller/disconnectController.js';
import { handleGameMove } from './controller/gameController.js';
import { auth } from './middleware/auth.js';

export default function registerSocketHandlers(io: Server) {
  io.use(auth);
  io.on('connection', (socket: Socket) => {
    console.log(`${socket.data.user.username} connected`);

    socket.on('room:create', (callback) => createRoom(socket, callback));
    socket.on('room:join', (roomId: string, callback) => joinRoom(io, socket, roomId, callback));
    socket.on('room:leave', (roomId: string) => leaveRoom(io, socket, roomId));
    socket.on('game:move', (data) => handleGameMove(socket, data));
    socket.on('disconnect', () => handleDisconnect(io, socket));
  });
}