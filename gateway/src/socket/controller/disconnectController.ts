import { Socket, Server } from "socket.io";

export function handleDisconnect(io: Server, socket: Socket) {
  console.log(`User '${socket.data.user.username}' disconnected`);
  
  socket.rooms.forEach((room) => {
    if (room !== socket.id) {
      socket
        .to(room)
        .emit("player:disconnected", { message: "Opponent has disconnected" });
    }
  });
}
