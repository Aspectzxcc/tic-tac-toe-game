import { Server, Socket } from 'socket.io';
import { createRoom, joinRoom } from './roomController.ts';

export default function registerSocketHandlers(io: Server) {
  io.on('connection', (socket: Socket) => {
    console.log(`${socket.id} connected`);

    // create room
    socket.on('room:create', (callback) => {
      createRoom(socket, callback);
    });

    socket.on('room:join', (roomId: string, callback) => {
      joinRoom(io, socket, roomId, callback);
    });

    socket.on('game:move', (data) => {
      const { roomId, move } = data as { roomId: string; move: any };
      socket.to(roomId).emit('game:move', move);
      console.log(`${socket.id} made move in room ${roomId}`);
      console.log("Move data:", move);
    });

    socket.on('disconnect', () => {
      console.log(`${socket.id} disconnected`);
      const rooms = Array.from(socket.rooms).filter((r) => r !== socket.id);
      rooms.forEach((roomId) => {
        socket.to(roomId).emit('player:disconnected', { message: 'Opponent disconnected' });
      });
    });
  });
}