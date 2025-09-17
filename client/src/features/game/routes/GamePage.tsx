import { useEffect, useState } from "react";
import { useParams, useLoaderData } from "react-router-dom";
import { useSocket } from "@/context/SocketContext";
import { GameBoard } from "../components/GameBoard";
import { GameHeader } from "../components/GameHeader";
import { PlayerCard } from "../components/PlayerCard";
import { makeMove } from "@/api/gamelogic";
import { TrophyIcon } from "@/components/icons/TrophyIcon";

interface Player {
  id: string;
  username: string;
  symbol: "X" | "O";
}

interface GameState {
  board: ("X" | "O" | "")[][];
  players: Player[];
  currentPlayerId: string;
  winnerId: string | null;
  hostId: string;
}

interface Game {
  gameId: string;
  gameState: GameState;
}

interface GameLoaderData {
  game: Game;
}

export function GamePage() {
  const { gameId } = useParams<{ gameId: string }>();
  const { game: initialGame } = useLoaderData() as GameLoaderData;
  const { socket } = useSocket();

  const [game, setGame] = useState<Game>(initialGame);
  const [user] = useState(() =>
    JSON.parse(localStorage.getItem("user") || "{}")
  );

  useEffect(() => {
    if (!socket || !gameId) return;

    const handleStateUpdate = (updatedGame: Game) => {
      if (updatedGame.gameId === gameId) {
        setGame(updatedGame);
      }
    };

    socket.on("game:state_update", handleStateUpdate);

    return () => {
      socket.off("game:state_update", handleStateUpdate);
    };
  }, [socket, gameId]);

  const handleCellClick = async (row: number, col: number) => {
    if (
      !gameId ||
      game.gameState.board[row][col] ||
      game.gameState.winnerId ||
      game.gameState.currentPlayerId !== user.id
    ) {
      return;
    }

    try {
      const response = await makeMove(gameId, user.id, { row, col });
      setGame(response.data);
    } catch (error) {
      console.log(error);
      const errorMessage = (error as any).response?.data?.error || "An unknown error occurred while making the move.";
      console.error("Error making move:", errorMessage);
      alert(errorMessage);
    }
  };

  const player1 = game.gameState.players.find((p) => p.symbol === "X");
  const player2 = game.gameState.players.find((p) => p.symbol === "O");

  const isMyTurn = game.gameState.currentPlayerId === user.id;
  const winner = game.gameState.players.find(
    (p) => p.id === game.gameState.winnerId
  );

  return (
    <div className="bg-background min-h-screen p-4 sm:p-8 flex flex-col items-center justify-center font-sans">
      <div className="w-full max-w-7xl flex flex-col flex-grow">
        <GameHeader />
        {game.gameState.winnerId && (
          <div className="text-center mb-4 p-4 bg-yellow-100 border-2 border-yellow-300 rounded-lg shadow-md">
            <TrophyIcon className="h-8 w-8 mx-auto text-yellow-500" />
            <h2 className="text-2xl font-bold mt-2">
              {game.gameState.winnerId === "Tie"
                ? "It's a Tie!"
                : `${winner?.username} wins!`}
            </h2>
          </div>
        )}
        <main className="flex-grow w-full flex items-center justify-center gap-4 lg:gap-12">
          {player1 ? (
            <PlayerCard
              username={player1.username}
              playerSymbol="X"
              isCurrentUser={player1.id === user.id}
              isTurn={game.gameState.currentPlayerId === player1.id}
            />
          ) : (
            <div className="w-full max-w-xs md:max-w-sm" />
          )}

          <GameBoard
            board={game.gameState.board}
            onCellClick={handleCellClick}
            isTurn={isMyTurn}
            winner={game.gameState.winnerId}
          />

          {player2 ? (
            <PlayerCard
              username={player2.username}
              playerSymbol="O"
              isCurrentUser={player2.id === user.id}
              isTurn={game.gameState.currentPlayerId === player2.id}
            />
          ) : (
            // Placeholder to keep layout consistent while waiting for P2
            <PlayerCard
              username="Waiting..."
              playerSymbol="O"
              isCurrentUser={false}
              isTurn={false}
            />
          )}
        </main>
      </div>
    </div>
  );
}
