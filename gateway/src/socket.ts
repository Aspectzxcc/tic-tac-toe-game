import { Server, Socket } from 'socket.io';

export default function registerSocketHandlers(io: Server) {
  io.on('connection', (socket: Socket) => {
    console.log(`${socket.id} connected`);

    socket.on('room:create', (callback) => {
      const roomId = Math.random().toString(36).substring(2, 8);
      socket.join(roomId);
      callback(roomId);
      console.log(`${socket.id} created room ${roomId}`);
    });

    socket.on('room:join', (roomId: string, callback) => {
      const room = io.sockets.adapter.rooms.get(roomId);
      if (room && room.size < 2) {
        socket.join(roomId);
        callback({ success: true });
        console.log(`${socket.id} joined room ${roomId}`);
        io.to(roomId).emit('room:ready');
      } else {
        callback({ success: false, message: 'Room is full or does not exist' });
      }
    });

    socket.on('game:move', (data) => {
      const { roomId, move } = data as { roomId: string; move: any };
      socket.to(roomId).emit('game:move', move);
      console.log(`${socket.id} made move in room ${roomId}`);
      console.log("Move data:", move);
    });

    socket.on('disconnect', () => {
      console.log(`${socket.id} disconnected`);
    });
  });
}