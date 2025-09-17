import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, RefreshCwIcon } from "@/components/icons/GameIcons";
import { Link, useNavigate, useParams } from "react-router-dom";
import { leaveGame } from "@/api/gamelogic";

export function GameHeader() {
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

  return (
    <header className="flex items-center justify-between w-full mb-8">
      <Link to="/lobby">
        <Button variant="outline" onClick={handleLeaveGame}>
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Back to Lobby
        </Button>
      </Link>

      <div className="text-center">
        <h1 className="text-3xl font-bold">Tic Tac Pro</h1>
        <p className="text-muted-foreground">Battle Arena</p>
      </div>

      <Button variant="outline">
        <RefreshCwIcon className="mr-2 h-4 w-4" />
        New Game
      </Button>
    </header>
  );
}
