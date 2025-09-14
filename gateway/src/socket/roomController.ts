import { Socket, Server } from "socket.io";
import { roomStore } from "./roomStore.js";

export function createRoom(socket: Socket, callback: (roomId: string) => void) {
  const roomId = Math.random().toString(36).substring(2, 8);
  roomStore.createRoom(roomId, socket.id);
  socket.join(roomId);
  callback(roomId);
  console.log(`${socket.id} created room ${roomId}`);
}

export function joinRoom(io: Server, socket: Socket, roomId: string, callback: (response: { success: boolean; message?: string }) => void) {
  const room = io.sockets.adapter.rooms.get(roomId);
  if (socket.rooms.has(roomId)) {
    callback({ success: true });
    return;
  }

  if (room && room.size < 2) {
    roomStore.joinRoom(roomId, socket.id);
    socket.join(roomId);
    callback({ success: true });
    console.log(`${socket.id} joined room ${roomId}`);
    io.to(roomId).emit('room:ready');
  } else {
    callback({ success: false, message: 'Room is full or does not exist' });
  }
}