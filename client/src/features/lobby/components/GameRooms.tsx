import { UsersIcon } from "@/components/icons/GameIcons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useSocket } from "@/context/SocketContext";
import { useNavigate } from "react-router-dom";
import { createGame, joinGame } from "@/api/gamelogic";

interface GameRoomsProps {
  initialRooms: Room[];
}

interface Player {
  id: string;
  username: string;
  symbol: "X" | "O";
}

interface Room {
  gameId: string;
  gameState: {
    board: string[][];
    players: Player[];
    currentPlayerId: string;
    winnerId: string | null;
  };
}

export function GameRooms({ initialRooms }: GameRoomsProps) {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
  const { socket } = useSocket();
  const navigate = useNavigate();

  useEffect(() => {
    if (!socket) return;

    socket.on("games:updated", (updatedRooms: Room[]) => {
      setRooms(updatedRooms);
    });

    return () => {
      socket.off("games:updated");
    };
  }, [socket]);

  const handleCreateRoom = async () => {
    if (!socket) return;

    try {
      const response = await createGame(user.id, user.username);
      navigate(`/game/${response.data.gameId}`);
    } catch (error) {
      console.error("Error creating room:", (error as any).response?.data?.error);
      alert((error as any).response?.data?.error);
    }
  };

  const handleJoinRoom = async () => {
    if (!socket || !selectedGameId) return;

    try {
      await joinGame(selectedGameId, user.id, user.username);
      navigate(`/game/${selectedGameId}`);
    } catch (error) {
      console.error("Error joining room:", (error as any).response?.data?.error);
      alert((error as any).response?.data?.error);
    }
  };

  return (
    <Card className="shadow-lg rounded-xl h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center gap-3">
          <UsersIcon className="w-6 h-6 text-primary" />
          <CardTitle className="font-semibold">Game Rooms</CardTitle>
        </div>
        <CardDescription>
          Choose a room to join or create your own
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        {rooms.length > 0 ? (
          rooms.map((room) => {
            const playerCount = room.gameState.players.length;
            const isFull = playerCount >= 2;

            return (
              <div
                key={room.gameId}
                onClick={() => !isFull && setSelectedGameId(room.gameId)}
                className={cn(
                  "p-4 border rounded-lg flex justify-between items-center transition-all",
                  isFull
                    ? "bg-gray-100 cursor-not-allowed opacity-60"
                    : "cursor-pointer hover:border-primary",
                  selectedGameId === room.gameId && "border-primary border-2"
                )}
              >
                <div>
                  <p className="font-bold">Room: {room.gameId}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>
                      Host: {room.gameState.players[0]?.username || "N/A"}
                    </span>
                    <span>({playerCount}/2 players)</span>
                  </div>
                </div>
                <Badge
                  variant={isFull ? "destructive" : "default"}
                  className={
                    !isFull
                      ? "bg-green-100 text-green-700 border-green-200"
                      : ""
                  }
                >
                  {isFull ? "Full" : "Available"}
                </Badge>
              </div>
            );
          })
        ) : (
          <p className="text-muted-foreground text-center">
            No active rooms. Create one to get started!
          </p>
        )}
      </CardContent>
      <CardFooter className="grid grid-cols-2 gap-4">
        <Button
          className="w-full font-semibold"
          disabled={!selectedGameId}
          onClick={handleJoinRoom}
        >
          Join Game
        </Button>
        <Button
          className="w-full font-semibold"
          variant="outline"
          onClick={handleCreateRoom}
        >
          Create Room
        </Button>
      </CardFooter>
    </Card>
  );
}
