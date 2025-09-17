import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSocket } from "@/context/SocketContext";
import { GameBoard } from "../components/GameBoard";
import { GameHeader } from "../components/GameHeader";
import { PlayerCard } from "../components/PlayerCard";

export function GamePage() {
  const { gameId } = useParams<{ gameId: string }>();
  const { socket } = useSocket();

  useEffect(() => {
    return () => {
      if (socket && gameId) {
        socket.emit("room:leave", gameId);
      }
    };
  }, [socket, gameId]);

  return (
    <div className="bg-background min-h-screen p-4 sm:p-8 flex flex-col items-center justify-center font-sans">
      <div className="w-full max-w-7xl flex flex-col flex-grow">
        {/* Header stays at the top */}
        <GameHeader />

        {/* Main content grows to fill the space and centers the game */}
        <main className="flex-grow w-full flex items-center justify-center gap-4 lg:gap-12">
          <PlayerCard username="a" playerSymbol="X" isCurrentUser={true} isTurn={true} />
          <GameBoard />
          <PlayerCard username="Sarah_X" playerSymbol="O" isCurrentUser={false} isTurn={false} />
        </main>
      </div>
    </div>
  );
}