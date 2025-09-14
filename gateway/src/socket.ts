import { Server, Socket } from 'socket.io';

export default function registerSocketHandlers(io: Server) {
  io.on('connection', (socket: Socket) => {
    console.log(`${socket.id} connected`);

    socket.on('disconnect', () => {
      console.log(`${socket.id} disconnected`);
    });
  });
}