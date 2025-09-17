import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { AppRouter } from "./router";
import { SocketProvider } from "./context/SocketContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SocketProvider>
      <AppRouter />
    </SocketProvider>
  </StrictMode>
);
