import { Socket, Server } from "socket.io";
import { roomStore } from "../roomStore.js";
import { createGame, joinGame } from "../../client/gamelogicClient.js";

export async function createRoom(socket: Socket, callback: (roomId: string) => void) {
  const roomId = Math.random().toString(36).substring(2, 8);
  roomStore.createRoom(roomId, socket.id);
  socket.join(roomId);

  try {
    await createGame(socket.id, roomId);
    callback(roomId);
    console.log(`${socket.data.user.username} created room ${roomId}`);
  } catch (error: any) {
    console.error("Error creating game in gamelogic:", error?.response?.data || error.message);
    callback(error.response?.data?.error || "Creation failed");
  }
}

export async function joinRoom(
  io: Server,
  socket: Socket,
  roomId: string,
  callback: (response: { success: boolean; message?: string }) => void
) {
  const room = io.sockets.adapter.rooms.get(roomId);
  if (socket.rooms.has(roomId)) {
    callback({ success: true });
    return;
  }

  if (room && room.size < 2) {
    roomStore.joinRoom(roomId, socket.id);
    socket.join(roomId);

    try {
      await joinGame(roomId, socket.id);
      callback({ success: true });
      console.log(`${socket.id} joined room ${roomId}`);
      io.to(roomId).emit('room:ready');
    } catch (error: any) {
      console.error("Error joining game in gamelogic:", error?.response?.data || error.message);
      callback({ success: false, message: error?.response?.data?.error || "Join failed" });
    }
  } else {
    callback({ success: false, message: 'Room is full or does not exist' });
  }
}