import { Socket, Server } from "socket.io";
import { getGames, leaveGame } from "../../client/gamelogicClient.js";

const pendingDisconnects = new Map<string, NodeJS.Timeout>();

export async function handleDisconnect(io: Server, socket: Socket) {
  const userId = socket.data.user?.id || socket.data.user?.username;
  console.log(`User '${userId}' disconnected`);

  // Start a timeout for this user
  const timeout = setTimeout(async () => {
    try {
      const response = await getGames();
      const games = response.data;
      for (const game of games) {
        const playerIds = Object.keys(game.gameState.players || {});
        if (playerIds.includes(userId)) {
          try {
            await leaveGame(game.gameId, userId);
            console.log(
              `Notified gamelogic to remove user '${userId}' from game '${game.gameId}'`
            );
            socket
              .to(game.gameId)
              .emit("player:disconnected", { message: "Opponent has disconnected" });
          } catch (error: any) {
            console.error(
              `Failed to notify gamelogic for user '${userId}' leaving game '${game.gameId}':`,
              error?.response?.data || error.message
            );
          }
        }
      }
    } catch (error) {
      console.error("Failed to fetch games from gamelogic service:", error);
    }
    pendingDisconnects.delete(userId);
  }, 15000); // 15 seconds

  pendingDisconnects.set(userId, timeout);
}

// Call this on reconnect to clear the timeout
export function handleReconnect(socket: Socket) {
  const userId = socket.data.user?.id || socket.data.user?.username;
  const timeout = pendingDisconnects.get(userId);
  if (timeout) {
    clearTimeout(timeout);
    pendingDisconnects.delete(userId);
    console.log(`User '${userId}' reconnected in time, not removing from game.`);
  }
}
