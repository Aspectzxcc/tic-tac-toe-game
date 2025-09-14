import { Server, Socket } from 'socket.io';
import { createRoom, joinRoom } from './roomController.ts';
import { RoomStore } from './roomStore.ts';

const roomStore = new RoomStore();

export default function registerSocketHandlers(io: Server) {
  io.on('connection', (socket: Socket) => {
    console.log(`${socket.id} connected`);

    // create room
    socket.on('room:create', (callback) => {
      createRoom(roomStore, socket, callback);
    });

    socket.on('room:join', (roomId: string, callback) => {
      joinRoom(io, socket, roomStore, roomId, callback);
    });

    socket.on('game:move', (data) => {
      const { roomId, move } = data as { roomId: string; move: any };
      socket.to(roomId).emit('game:move', move);
      console.log(`${socket.id} made move in room ${roomId}`);
      console.log("Move data:", move);
    });

    socket.on('disconnect', (data) => {
      console.log(`${socket.id} disconnected`);
      const rooms = Array.from(socket.rooms).filter((r) => r !== socket.id);
      rooms.forEach((roomId) => {
        socket.to(roomId).emit('player:disconnected', { message: 'Opponent disconnected' });
      });

      const { roomId } = data as { roomId?: string };

      setTimeout(() => {
        if (roomId) {
          const room = io.sockets.adapter.rooms.get(roomId);
          if (!room || room.size === 0) {
            console.log(`Room ${roomId} is now empty and will be deleted`);
          }
        }
      }, 30000) // 30 seconds
    });
  });
}