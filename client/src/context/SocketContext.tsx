// client/src/context/SocketContext.tsx

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import io, { Socket } from "socket.io-client";
import { useLocation } from "react-router-dom";

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
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token && !socketRef.current) {
      console.log("Token found, attempting to connect socket...");
      socketRef.current = io("http://localhost:3001", {
        auth: { token },
      });

      socketRef.current.on("connect", () => {
        console.log("Socket connected!");
        setIsConnected(true);
      });

      socketRef.current.on("disconnect", () => {
        console.log("Socket disconnected.");
        setIsConnected(false);
      });

      socketRef.current.on("connect_error", (err) => {
        console.error("Socket connection error:", err.message);
      });
    }
    else if (!token && socketRef.current) {
      console.log("No token found, disconnecting socket.");
      socketRef.current.disconnect();
      socketRef.current = null;
    }

  }, [location.pathname]);

  return (
    <SocketContext.Provider value={{ socket: socketRef.current, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
