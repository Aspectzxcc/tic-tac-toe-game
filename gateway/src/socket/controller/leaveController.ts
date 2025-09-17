import { Server, Socket } from "socket.io";
import { leaveGame } from "../../client/gamelogicClient.js";

export async function leaveRoom(io: Server, socket: Socket, gameId: string) {
  const user = socket.data.user;
  if (!user || !gameId) return;

  try {
    await leaveGame(gameId, user.id);
    socket.to(gameId).emit("player:disconnected", {
      message: `${user.username} has left the game.`
    });
    console.log(`${user.username} left room: ${gameId} and notified gamelogic service.`);
  } catch (error: any) {
    console.error(
      `Error notifying gamelogic service for user '${user?.username}' leaving game '${gameId}':`,
      error?.response?.data || error.message
    );
  }
}
