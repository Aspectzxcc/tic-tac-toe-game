import { ClockIcon } from "@/components/icons/GameIcons";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const players = [
  { name: "Alex_Pro", rank: "Diamond", status: "playing" },
  { name: "Sarah_X", rank: "Gold", status: "waiting" },
  { name: "Mike_O", rank: "Silver", status: "online" },
  { name: "Luna_Star", rank: "Platinum", status: "playing" },
];

export function OnlinePlayers() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'playing': return <Badge className="bg-red-100 text-red-700">playing</Badge>;
      case 'waiting': return <Badge className="bg-yellow-100 text-yellow-700">waiting</Badge>;
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
        <ul className="space-y-4">
          {players.map((player) => (
            <li key={player.name} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>{player.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{player.name}</p>
                  <p className="text-sm text-muted-foreground">{player.rank}</p>
                </div>
              </div>
              {getStatusBadge(player.status)}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}