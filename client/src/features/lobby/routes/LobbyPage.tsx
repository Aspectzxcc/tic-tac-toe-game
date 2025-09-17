import { GameRooms } from "../components/GameRooms";
import { Header } from "../components/Header";
import { OnlinePlayers } from "../components/OnlinePlayers";
import { PlayerStats } from "../components/PlayerStats";
import { useSocket } from "@/context/SocketContext";
import { useEffect } from "react";

export function LobbyPage() {
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    if (socket) {
      socket.on("some_event", (data) => {
        console.log("Received some_event:", data);
      });

      return () => {
        socket.off("some_event");
      };
    }
  }, [socket]);

  return (
    <div className="bg-background min-h-screen p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <Header />
        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-8">
            <PlayerStats />
            <OnlinePlayers />
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2">
            <GameRooms />
            {/* You can display connection status for debugging */}
            <div className="mt-4 text-center text-sm text-muted-foreground">
              Connection Status: {isConnected ? "Connected" : "Disconnected"}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
