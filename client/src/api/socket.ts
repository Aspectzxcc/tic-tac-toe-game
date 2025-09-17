import { io, Socket } from "socket.io-client";

const token = localStorage.getItem("token");

export const socket: Socket = io("http://localhost:3001", {
  auth: { token },
  autoConnect: true,
});