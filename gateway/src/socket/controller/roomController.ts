import { Socket, Server } from "socket.io";
import { createGame, joinGame } from "../../client/gamelogicClient.js";

export async function createRoom(
  socket: Socket,
  callback: (response: {
    success: boolean;
    roomId?: string;
    message?: string;
  }) => void
) {
  const playerId = socket.data.user.id;
  const roomId = `room-${Math.random().toString(36).substring(2, 8)}`;

  try {
    await createGame(playerId, roomId);
    socket.join(roomId);

    callback({ success: true, roomId });
    console.log(
      `User '${socket.data.user.username}' (ID: ${playerId}) created room ${roomId}`
    );
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.error || "Failed to create game.";
    console.error(`Error creating game for player ${playerId}:`, errorMessage);
    callback({ success: false, message: errorMessage });
  }
}

export async function joinRoom(
  io: Server,
  socket: Socket,
  roomId: string,
  callback: (response: { success: boolean; message?: string }) => void
) {
  const playerId = socket.data.user.id;
  const room = io.sockets.adapter.rooms.get(roomId);

  if (room && room.size >= 2) {
    callback({ success: false, message: "This room appears full." });
    return;
  }

  try {
    await joinGame(roomId, playerId);
    socket.join(roomId);

    console.log(
      `User '${socket.data.user.username}' (ID: ${playerId}) joined room ${roomId}`
    );
    io.to(roomId).emit("room:ready");
    callback({ success: true });
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.error || "Failed to join the game.";
    console.error(
      `Error for player ${playerId} joining room ${roomId}:`,
      errorMessage
    );
    callback({ success: false, message: errorMessage });
  }
}

export function leaveRoom(io: Server, socket: Socket, roomId: string) {
  socket.leave(roomId);
  socket
    .to(roomId)
    .emit("player:disconnected", { message: "Opponent has left the room" });
  console.log(`User '${socket.data.user.username}' left room ${roomId}`);
}
