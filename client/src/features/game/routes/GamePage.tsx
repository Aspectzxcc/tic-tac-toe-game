import { GameBoard } from "../components/GameBoard";
import { GameHeader } from "../components/GameHeader";
import { PlayerCard } from "../components/PlayerCard";

export function GamePage() {
  return (
    <div className="bg-background min-h-screen p-8 font-sans flex flex-col items-center">
      <div className="w-full max-w-7xl">
        <GameHeader />
        <main className="flex items-start justify-center gap-8 mt-8">
          <PlayerCard username="a" playerSymbol="X" isCurrentUser={true} isTurn={true} />
          <GameBoard />
          <PlayerCard username="Sarah_X" playerSymbol="O" isCurrentUser={false} isTurn={false} />
        </main>
      </div>
    </div>
  );
}