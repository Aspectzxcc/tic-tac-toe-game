import { Socket } from "socket.io";
import { calculateMove } from "../../client/gamelogicClient.js";

export async function handleGameMove(
  socket: Socket,
  data: { roomId: string; move: any }
) {
  const { roomId, move } = data;
  try {
    const playerId = socket.data.user.id;
    const response = await calculateMove(roomId, playerId, move);

    socket.to(roomId).emit("game:move", response.data.gameState);
    socket.emit("game:move", response.data.gameState);

    console.log(`User ${playerId} made a move in room ${roomId}`);
  } catch (error: any) {
    console.error(
      "Error handling move:",
      error?.response?.data || error.message
    );
    socket.emit("game:error", {
      message: error?.response?.data?.error || "Move failed",
    });
  }
}
