import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, RefreshCwIcon } from "@/components/icons/GameIcons";
import { useNavigate, useParams } from "react-router-dom";
import { leaveGame, resetGame } from "@/api/gamelogic";

interface GameHeaderProps {
  winnerId: string | null;
}

export function GameHeader({ winnerId }: GameHeaderProps) {
  const navigate = useNavigate();
  const { gameId } = useParams<{ gameId: string }>();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLeaveGame = async () => {
    if (!gameId || !user.id) {
      navigate("/lobby");
      return;
    }

    try {
      await leaveGame(gameId, user.id);
      navigate("/lobby");
    } catch (error) {
      console.error("Failed to leave game:", error);
      navigate("/lobby");
    }
  };

  const handleNewGame = async () => {
    if (!gameId) return;
    try {
      await resetGame(gameId);
    } catch (error) {
      console.error("Failed to start a new game:", error);
    }
  };

  return (
    <header className="flex items-center justify-between w-full mb-8">
      <Button variant="outline" onClick={handleLeaveGame}>
        <ArrowLeftIcon className="mr-2 h-4 w-4" />
        Back to Lobby
      </Button>

      <div className="text-center">
        <h1 className="text-3xl font-bold">Tic Tac Pro</h1>
        <p className="text-muted-foreground">Battle Arena</p>
      </div>

      <Button
        variant="outline"
        onClick={handleNewGame}
        disabled={!winnerId}
        className={!winnerId ? 'invisible' : ''}
      >
        <RefreshCwIcon className="mr-2 h-4 w-4" />
        New Game
      </Button>
    </header>
  );
}