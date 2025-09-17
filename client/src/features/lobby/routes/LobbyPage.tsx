import { GameRooms } from "../components/GameRooms";
import { Header } from "../components/Header";
import { OnlinePlayers } from "../components/OnlinePlayers";
import { PlayerStats } from "../components/PlayerStats";
import { useSocket } from "@/context/SocketContext";
import { useLoaderData } from "react-router-dom";

interface LobbyLoaderData {
  initialRooms: any[];
}

export function LobbyPage() {
  const { initialRooms } = useLoaderData() as LobbyLoaderData;
  const { isConnected } = useSocket();

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
            {/* --- MODIFIED: Pass loader data as a prop --- */}
            <GameRooms initialRooms={initialRooms} />
            <div className="mt-4 text-center text-sm text-muted-foreground">
              Connection Status: {isConnected ? "Connected" : "Disconnected"}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
