import { io, Socket } from "socket.io-client";

const token = localStorage.getItem("token");

const API_BASE_URL = import.meta.env.VITE_GATEWAY_API_BASE_URL || "http://localhost:3001";

export const socket: Socket = io(API_BASE_URL, {
  auth: { token },
  autoConnect: true,
});