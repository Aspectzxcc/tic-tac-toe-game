// client/src/context/SocketContext.tsx

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { Socket } from "socket.io-client";
import { useLocation } from "react-router-dom";
// 1. Import the single socket instance
import { socket } from "@/api/socket"; 

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const location = useLocation();

  useEffect(() => {
    function onConnect() {
      console.log("Socket connected!");
      setIsConnected(true);
    }

    function onDisconnect() {
      console.log("Socket disconnected.");
      setIsConnected(false);
    }
    
    function onConnectError(err: Error) {
        console.error("Socket connection error:", err.message);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);

    const token = localStorage.getItem("token");
    if (token) {
      if (!socket.connected) {
        console.log("Token found, attempting to connect socket...");
        socket.auth = { token };
        socket.connect();
      }
    } else {
      if (socket.connected) {
        console.log("No token found, disconnecting socket.");
        socket.disconnect();
      }
    }

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);
    };
  }, [location.pathname]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};