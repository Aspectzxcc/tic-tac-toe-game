import { Server, Socket } from 'socket.io';
import { createRoom, joinRoom } from './controller/roomController.ts';
import { handleDisconnect } from './controller/disconnectController.ts';
import { handleGameMove } from './controller/gameController.ts';

export default function registerSocketHandlers(io: Server) {
  io.on('connection', (socket: Socket) => {
    console.log(`${socket.id} connected`);

    socket.on('room:create', (callback) => createRoom(socket, callback));
    socket.on('room:join', (roomId: string, callback) => joinRoom(io, socket, roomId, callback));
    socket.on('game:move', (data) => handleGameMove(socket, data));
    socket.on('disconnect', () => handleDisconnect(io, socket));
  });
}