// client/src/features/game/components/GameBoard.tsx
import { Card } from "@/components/ui/card";
import { OIcon, XIcon } from "@/components/icons/GameIcons";
import { cn } from "@/lib/utils";

type PlayerSymbol = "X" | "O" | "";

interface GameBoardProps {
  board: PlayerSymbol[][];
  onCellClick: (row: number, col: number) => void;
  isTurn: boolean;
  winner: string | null;
}

export function GameBoard({
  board,
  onCellClick,
  isTurn,
  winner,
}: GameBoardProps) {
  return (
    <Card className="shadow-lg rounded-xl p-6">
      <div className="grid grid-cols-3 gap-4">
        {board.flat().map((value, index) => {
          const row = Math.floor(index / 3);
          const col = index % 3;
          const isCellOccupied = !!value;

          return (
            <div
              key={index}
              onClick={() => onCellClick(row, col)}
              className={cn(
                "w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200 ease-in-out",
                "hover:bg-primary/10",
                {
                  "cursor-not-allowed opacity-50":
                    !isTurn || isCellOccupied || !!winner,
                }
              )}
            >
              {value === "X" && <XIcon className="text-blue-500 player-icon" />}
              {value === "O" && <OIcon className="text-red-500 player-icon" />}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
