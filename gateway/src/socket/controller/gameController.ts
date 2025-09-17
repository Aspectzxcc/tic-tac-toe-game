import { Socket, Server } from "socket.io";
import { roomStore } from "../roomStore.js";
import { createGame as createGameInGamelogic } from "../../client/gamelogicClient.js";

export function createRoom(socket: Socket, callback: (roomId: string) => void) {
  const roomId = Math.random().toString(36).substring(2, 8);
  roomStore.createRoom(roomId, socket.id);
  socket.join(roomId);
  callback(roomId);
  console.log(`${socket.data.user.username} created room ${roomId}`);
}

export async function joinRoom(
  io: Server,
  socket: Socket,
  roomId: string,
  callback: (response: { success: boolean; message?: string }) => void
) {
  if (socket.rooms.has(roomId)) {
    return callback({ success: true });
  }

  const roomData = roomStore.getRoom(roomId);
  const socketIoRoom = io.sockets.adapter.rooms.get(roomId);

  if (roomData && socketIoRoom && socketIoRoom.size < 2) {
    const firstPlayerSocketId = roomData.players[0];
    const firstPlayerSocket = io.sockets.sockets.get(firstPlayerSocketId);

    if (!firstPlayerSocket) {
      roomStore.removeRoom(roomId);
      return callback({
        success: false,
        message: "Room creator has disconnected.",
      });
    }

    const player1ID = firstPlayerSocket.data.user.id;
    const player2ID = socket.data.user.id;

    try {
      // Call gamelogic service to create the game state
      await createGameInGamelogic(player1ID, player2ID, roomId);

      // Join the room
      roomStore.joinRoom(roomId, socket.id);
      socket.join(roomId);
      console.log(`${socket.data.user.username} joined room ${roomId}`);

      // Notify players the room is ready to start
      io.to(roomId).emit("room:ready");
      callback({ success: true });
    } catch (error: any) {
      console.error(
        `Failed to create game in gamelogic for room ${roomId}:`,
        error.message
      );
      callback({ success: false, message: "Failed to create the game." });
    }
  } else {
    callback({ success: false, message: "Room is full or does not exist" });
  }
}
