import { GameRooms } from "../components/GameRooms";
import { Header } from "../components/Header";
import { OnlinePlayers } from "../components/OnlinePlayers";
import { PlayerStats } from "../components/PlayerStats";

export function LobbyPage() {
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
          </div>
        </main>
      </div>
    </div>
  );
}