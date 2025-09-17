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

interface GameRoomsProps {
  initialRooms: Room[];
}

interface Room {
  roomId: string;
  gameState: {
    board: string[][];
    players: { player1ID: string; player2ID: string };
    currentPlayer: string;
    winner: string | null;
  };
}

export function GameRooms({ initialRooms }: GameRoomsProps) {
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const { socket } = useSocket();
  const navigate = useNavigate();

  useEffect(() => {
    if (!socket) return;

    socket.on("game:created", (updatedRooms: Room[]) => {
      console.log("Received room update from server:", updatedRooms);
      setRooms(updatedRooms);
    });

    return () => {
      socket.off("game:created");
    };
  }, [socket]);

  const handleCreateRoom = () => {
    if (!socket) return;

    socket.emit("room:create", (roomId: string) => {
      console.log(`Room created with ID: ${roomId}`);
      navigate(`/game/${roomId}`);
    });
  };

  const handleJoinRoom = () => {
    if (!socket || !selectedRoomId) return;

    socket.emit(
      "room:join",
      selectedRoomId,
      (response: { success: boolean; message?: string }) => {
        if (response.success) {
          console.log(`Successfully joined room: ${selectedRoomId}`);
          navigate(`/game/${selectedRoomId}`);
        } else {
          alert(`Failed to join room: ${response.message}`);
        }
      }
    );
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
            const playerCount = Object.keys(room.gameState.players).length;
            const isFull = playerCount >= 2;

            return (
              <div
                key={room.roomId}
                onClick={() => !isFull && setSelectedRoomId(room.roomId)}
                className={cn(
                  "p-4 border rounded-lg flex justify-between items-center transition-all",
                  isFull
                    ? "bg-gray-100 cursor-not-allowed opacity-60"
                    : "cursor-pointer hover:border-primary",
                  selectedRoomId === room.roomId && "border-primary border-2"
                )}
              >
                <div>
                  <p className="font-bold">Room: {room.roomId}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{playerCount}/2 players</span>
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
          disabled={!selectedRoomId}
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
