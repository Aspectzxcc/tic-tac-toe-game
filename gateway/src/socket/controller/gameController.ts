import { Socket } from "socket.io";

export function handleGameMove(socket: Socket, data: { roomId: string; move: any }) {
  const { roomId, move } = data;
  socket.to(roomId).emit('game:move', move);
  console.log(`${socket.id} made move in room ${roomId}`);
  console.log("Move data:", move);
}