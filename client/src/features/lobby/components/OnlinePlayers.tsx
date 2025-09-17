import { ClockIcon } from "@/components/icons/GameIcons";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSocket } from "@/context/SocketContext";
import { useEffect, useState } from "react";

interface Player {
  id: string;
  username: string;
  status: 'online' | 'playing';
}

export function OnlinePlayers() {
  const [players, setPlayers] = useState<Player[]>([]);
  const { socket } = useSocket();
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");


  useEffect(() => {
    if (socket) {
      const handlePlayersUpdate = (updatedPlayers: Player[]) => {
        // Filter out the current user from the list
        setPlayers(updatedPlayers.filter(p => p.id !== currentUser.id));
      };
      
      socket.on('online-players:updated', handlePlayersUpdate);
      
      // Explicitly request the player list when component is ready
      socket.emit('online-players:get');
    }
    
    return () => {
      if (socket) {
        socket.off('online-players:updated');
      }
    };
  }, [socket, currentUser.id]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'playing': return <Badge className="bg-red-100 text-red-700">playing</Badge>;
      default: return <Badge className="bg-blue-100 text-blue-700">online</Badge>;
    }
  };

  return (
    <Card className="shadow-lg rounded-xl">
      <CardHeader className="flex flex-row items-center gap-3 space-y-0">
        <ClockIcon className="w-6 h-6 text-primary" />
        <CardTitle className="font-semibold">Online Players</CardTitle>
      </CardHeader>
      <CardContent>
        {players.length > 0 ? (
          <ul className="space-y-4">
            {players.map((player) => (
              <li key={player.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>{player.username.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{player.username}</p>
                  </div>
                </div>
                {getStatusBadge(player.status)}
              </li>
            ))}
          </ul>
        ) : (
           <p className="text-muted-foreground text-center">No other players online.</p>
        )}
      </CardContent>
    </Card>
  );
}