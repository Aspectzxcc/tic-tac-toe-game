import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ClockIcon } from "@/components/icons/GameIcons";
import { cn } from "@/lib/utils";

interface PlayerCardProps {
  username: string;
  playerSymbol: 'X' | 'O';
  isCurrentUser: boolean;
  isTurn: boolean;
}

export function PlayerCard({ username, playerSymbol, isCurrentUser, isTurn }: PlayerCardProps) {
  const avatarBg = playerSymbol === 'X' ? 'bg-blue-500' : 'bg-red-500';

  return (
    <Card className="shadow-lg rounded-xl w-full max-w-sm">
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Avatar className="h-12 w-12 border-2">
            <AvatarFallback className={cn("text-white font-bold", avatarBg)}>
              {username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-bold text-lg">{username}</h3>
            <Badge variant={playerSymbol === 'X' ? 'default' : 'destructive'}>Player {playerSymbol}</Badge>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm font-medium text-muted-foreground">Status</p>
            {isTurn ? (
              <Badge className="bg-primary text-primary-foreground">Your Turn</Badge>
            ) : (
              <Badge variant="destructive">Waiting</Badge>
            )}
          </div>

          <div className="space-y-2">
             <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <ClockIcon className="w-4 h-4" />
                <span>Time: 27s</span>
            </div>
            <Progress value={45} className="h-2 [&>*]:bg-pink-500" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}