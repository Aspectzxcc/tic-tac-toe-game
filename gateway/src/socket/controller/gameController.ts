import { Socket } from "socket.io";
import { calculateMove } from "../../client/gamelogicClient.js";

export async function handleGameMove(socket: Socket, data: { roomId: string; move: any }) {
  const { roomId, move } = data;
  try {
    // Use the socket id as playerId (or adapt as needed)
    const playerId = socket.id;
    const response = await calculateMove(roomId, playerId, move);

    // Broadcast the updated game state to the room
    socket.to(roomId).emit('game:move', response.data.gameState);
    // Optionally, emit to the player who made the move as well
    socket.emit('game:move', response.data.gameState);

    console.log(`${socket.id} made move in room ${roomId}`);
    console.log("Move data:", move);
  } catch (error: any) {
    console.error("Error handling move:", error?.response?.data || error.message);
    socket.emit('game:error', { message: error?.response?.data?.error || "Move failed" });
  }
}