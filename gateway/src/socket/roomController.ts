import { Socket } from "socket.io";

export function createRoom(socket: Socket, callback: (roomId: string) => void) {
  const roomId = Math.random().toString(36).substring(2, 8);
  socket.join(roomId);
  callback(roomId);
  console.log(`${socket.id} created room ${roomId}`);
}

export function joinRoom(io: any, socket: Socket, roomId: string, callback: (response: { success: boolean; message?: string }) => void) {
  const room = io.sockets.adapter.rooms.get(roomId);
  if (socket.rooms.has(roomId)) {
    callback({ success: true });
    return;
  }

  if (room && room.size < 2) {
    socket.join(roomId);
    callback({ success: true });
    console.log(`${socket.id} joined room ${roomId}`);
    io.to(roomId).emit('room:ready');
  } else {
    callback({ success: false, message: 'Room is full or does not exist' });
  }
}