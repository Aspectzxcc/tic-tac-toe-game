import { Socket, Server } from "socket.io";
import { getGames, leaveGame } from "../../client/gamelogicClient.js";

export async function handleDisconnect(io: Server, socket: Socket) {
  const userId = socket.data.user?.id || socket.data.user?.username;
  console.log(`User '${userId}' disconnected`);

  try {
    // 1. Get all games from gamelogic service
    const response = await getGames();
    const games = response.data;

    // 2. Find games where this user is a player
    for (const game of games) {
      const playerIds = Object.keys(game.gameState.players || {});
      if (playerIds.includes(userId)) {
        // 3. Notify gamelogic service to remove the user from the game
        try {
          await leaveGame(game.gameId, userId);
          console.log(
            `Notified gamelogic to remove user '${userId}' from game '${game.gameId}'`
          );
          // Optionally, notify other sockets in this game room
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
}
