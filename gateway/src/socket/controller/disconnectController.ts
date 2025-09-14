import { Socket, Server } from "socket.io";
import { roomStore } from "../roomStore";

export function handleDisconnect(io: Server, socket: Socket) {
  console.log(`${socket.id} disconnected`);
  const rooms = roomStore.getAllRooms().filter((r) => r.id !== socket.id);
  
  rooms.forEach((room) => {
    socket.to(room.id).emit('player:disconnected', { message: 'Opponent disconnected' });
  });
}