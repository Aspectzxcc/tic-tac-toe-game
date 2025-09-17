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
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useSocket } from "@/context/SocketContext";
import { useNavigate } from "react-router-dom";

const rooms = [
  {
    id: "full-room",
    name: "Beginner Room",
    difficulty: "Easy",
    players: "2/2",
    status: "Full",
  },
  {
    id: "pro-arena",
    name: "Pro Arena",
    difficulty: "Hard",
    players: "1/2",
    status: "Available",
  },
  {
    id: "quick-match",
    name: "Quick Match",
    difficulty: "Medium",
    players: "0/2",
    status: "Available",
  },
];

export function GameRooms() {
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const { socket } = useSocket();
  const navigate = useNavigate();

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
        {rooms.map((room) => (
          <div
            key={room.id}
            onClick={() => room.status !== "Full" && setSelectedRoomId(room.id)}
            className={cn(
              "p-4 border rounded-lg flex justify-between items-center transition-all",
              room.status === "Full"
                ? "bg-gray-100 cursor-not-allowed opacity-60"
                : "cursor-pointer hover:border-primary",
              selectedRoomId === room.id && "border-primary border-2"
            )}
          >
            <div>
              <p className="font-bold">{room.name}</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Badge
                  variant={
                    room.difficulty === "Easy"
                      ? "secondary"
                      : room.difficulty === "Medium"
                      ? "default"
                      : "destructive"
                  }
                >
                  {room.difficulty}
                </Badge>
                <span>{room.players} players</span>
              </div>
            </div>
            <Badge
              variant={room.status === "Full" ? "destructive" : "default"}
              className="bg-green-100 text-green-700 border-green-200"
            >
              {room.status}
            </Badge>
          </div>
        ))}
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
