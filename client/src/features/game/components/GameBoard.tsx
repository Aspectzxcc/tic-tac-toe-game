import { Card } from "@/components/ui/card";
import { OIcon, XIcon } from "@/components/icons/GameIcons";
import { useState } from "react";
import { cn } from "@/lib/utils";

type Player = 'X' | 'O' | null;

export function GameBoard() {
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [winner, setWinner] = useState<Player>(null);

  const handleCellClick = (index: number) => {
    if (board[index] || winner) return;

    const newBoard = board.slice();
    newBoard[index] = currentPlayer;
    setBoard(newBoard);
    setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    // Add logic to check for a winner here
  };

  return (
    <Card className="shadow-lg rounded-xl p-6">
      <div className="grid grid-cols-3 gap-4">
        {board.map((value, index) => (
          <div
            key={index}
            onClick={() => handleCellClick(index)}
            className={cn(
                "w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200 ease-in-out",
                "hover:bg-primary/10",
                { "cursor-not-allowed": value || winner }
            )}
          >
            {value === 'X' && <XIcon className="text-blue-500 player-icon" />}
            {value === 'O' && <OIcon className="text-red-500 player-icon" />}
          </div>
        ))}
      </div>
    </Card>
  );
}