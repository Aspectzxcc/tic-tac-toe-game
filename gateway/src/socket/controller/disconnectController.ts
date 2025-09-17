import { Socket, Server } from "socket.io";
import { getGames, leaveGame } from "../../client/gamelogicClient.js";
import { removeUser, broadcastOnlinePlayers, removeUserSocket } from "../onlinePlayersManager.js";

const pendingDisconnects = new Map<string, NodeJS.Timeout>();

export async function handleDisconnect(io: Server, socket: Socket) {
  const user = socket.data.user;
  if (!user) return;

  console.log(`User '${user.username}' disconnected. Checking for host status...`);

  try {
    const response = await getGames();
    const games = response.data;

    let isHost = false;

    for (const game of games) {
      // Check if user is the host of any game
      if (game.gameState.hostId === user.id) {
        isHost = true;
        // Immediately remove the game
        await leaveGame(game.gameId, user.id);
        console.log(`Host '${user.username}' left game '${game.gameId}', game destroyed immediately.`);
      }
    }

    if (!isHost) {
      // Start a timeout for non-hosts
      const timeout = setTimeout(async () => {
        console.log(`Grace period for '${user.username}' ended. Performing cleanup.`);
        pendingDisconnects.delete(user.id);

        removeUser(user.id);
        removeUserSocket(user.id);
        broadcastOnlinePlayers(io);

        try {
          // Remove user from any games they're still in
          for (const game of games) {
            if (game.gameState.players.some((p: any) => p.id === user.id)) {
              await leaveGame(game.gameId, user.id);
              socket.to(game.gameId).emit("player:disconnected", {
                message: "Opponent has disconnected",
              });
            }
          }
        } catch (error) {
          console.error("Failed to clean up games for disconnect:", error);
        }
      }, 15000); // 15 seconds

      pendingDisconnects.set(user.id, timeout);
    }
  } catch (error) {
    console.error("Failed to fetch games for disconnect cleanup:", error);
  }
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