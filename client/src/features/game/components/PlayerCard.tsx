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

export function PlayerCard({ username, playerSymbol, isTurn }: PlayerCardProps) {
  const avatarBg = playerSymbol === 'X' ? 'bg-blue-500' : 'bg-red-500';

  return (
    <Card className="shadow-xl rounded-2xl w-full max-w-xs md:max-w-sm">
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-8">
          <Avatar className="h-14 w-14 border-2">
            <AvatarFallback className={cn("text-white font-bold text-xl", avatarBg)}>
              {username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-bold text-xl">{username}</h3>
            <Badge
              variant="outline"
              className={cn(
                playerSymbol === 'X'
                  ? 'border-blue-500 text-blue-500'
                  // The Player O badge in the image is black text on a light gray background, so we use `secondary`
                  : 'border-gray-300 bg-gray-200 text-gray-800'
              )}
            >
              Player {playerSymbol}
            </Badge>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <p className="text-md font-medium text-muted-foreground">Status</p>
            {isTurn ? (
              // This badge now matches the dark background from the image
              <Badge className="bg-gray-800 text-white">Your Turn</Badge>
            ) : (
              <Badge variant="destructive">Waiting</Badge>
            )}
          </div>

          <div className="space-y-2">
             <div className="flex items-center gap-2 text-md text-muted-foreground">
                <ClockIcon className="w-5 h-5" />
                <span>Time: 27s</span>
            </div>
            {/* The progress bar now has the correct pink color */}
            <Progress value={45} className="h-2 [&>*]:bg-pink-500" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}