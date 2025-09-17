import { Server } from "socket.io";
import { getGames } from "../client/gamelogicClient.js";

// --- Types ---
interface OnlineUser {
  id: string;
  username: string;
}

interface Game {
  gameId: string;
  gameState: {
    players: Record<string, 'X' | 'O'>;
  };
}

interface PlayerWithStatus extends OnlineUser {
  status: 'online' | 'playing';
}

// --- User Store ---
const onlineUsers = new Map<string, OnlineUser>();

export function addUser(user: OnlineUser) {
  if (!onlineUsers.has(user.id)) {
    onlineUsers.set(user.id, user);
  }
}

export function removeUser(userId: string) {
  onlineUsers.delete(userId);
}

export function getOnlineUsers(): OnlineUser[] {
  return Array.from(onlineUsers.values());
}

export function isUserOnline(userId: string): boolean {
  return onlineUsers.has(userId);
}


// --- Broadcaster ---
export async function broadcastOnlinePlayers(io: Server) {
  try {
    const response = await getGames();
    const games: Game[] = response.data;
    const currentOnlineUsers = getOnlineUsers();
    
    const playersInGame = new Set<string>();
    games.forEach(game => {
      Object.keys(game.gameState.players).forEach(playerId => {
        playersInGame.add(playerId);
      });
    });

    const playersWithStatus: PlayerWithStatus[] = currentOnlineUsers.map(user => ({
      ...user,
      status: playersInGame.has(user.id) ? 'playing' : 'online'
    }));
    
    io.emit('online-players:updated', playersWithStatus);
    console.log("Broadcasted updated online players list.");

  } catch (error) {
    console.error("Failed to fetch games to update online player status:", error);
    const currentOnlineUsers = getOnlineUsers();
    const playersWithStatus = currentOnlineUsers.map(u => ({ ...u, status: 'online' as const }));
    io.emit('online-players:updated', playersWithStatus);
  }
}