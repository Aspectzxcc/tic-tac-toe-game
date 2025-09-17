import { Socket, Server } from "socket.io";
import { getGames, leaveGame } from "../../client/gamelogicClient.js";
import { removeUser, broadcastOnlinePlayers } from "../onlinePlayersManager.js";

const pendingDisconnects = new Map<string, NodeJS.Timeout>();

export async function handleDisconnect(io: Server, socket: Socket) {
  const user = socket.data.user;
  if (!user) return;

  console.log(`User '${user.username}' disconnected. Starting grace period timer.`);

  const timeout = setTimeout(async () => {
    // If this timeout executes, it means the user did not reconnect in time.
    console.log(`Grace period for '${user.username}' ended. Performing cleanup.`);
    pendingDisconnects.delete(user.id); // Clean up the pending map

    removeUser(user.id);
    broadcastOnlinePlayers(io); // Broadcast the new list after removal

    try {
      const response = await getGames();
      const games = response.data;
      for (const game of games) {
        if (Object.keys(game.gameState.players || {}).includes(user.id)) {
          await leaveGame(game.gameId, user.id);
          socket
            .to(game.gameId)
            .emit("player:disconnected", {
              message: "Opponent has disconnected",
            });
        }
      }
    } catch (error) {
      console.error("Failed to fetch games for disconnect cleanup:", error);
    }
  }, 15000); // 15 seconds

  pendingDisconnects.set(user.id, timeout);
}

// This is called on a new connection and is the key to preventing cleanup
export function handleReconnect(socket: Socket) {
  const user = socket.data.user;
  if (!user) return;

  const timeout = pendingDisconnects.get(user.id);
  if (timeout) {
    clearTimeout(timeout);
    pendingDisconnects.delete(user.id);
    console.log(
      `User '${user.username}' reconnected in time. Cleanup cancelled.`
    );
  }
}