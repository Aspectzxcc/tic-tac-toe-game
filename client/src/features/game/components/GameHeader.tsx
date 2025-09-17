import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, RefreshCwIcon } from "@/components/icons/GameIcons";
import { Link } from "react-router-dom";

export function GameHeader() {
  return (
    <header className="flex items-center justify-between w-full mb-8">
      <Link to="/lobby">
        <Button variant="outline">
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