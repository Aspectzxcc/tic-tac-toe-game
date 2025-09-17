import { SwordsIcon } from "@/components/icons/GameIcons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

export function PlayerStats() {
  const stats = { wins: 12, losses: 8, draws: 3 };
  const totalGames = stats.wins + stats.losses + stats.draws;
  const winRate = totalGames > 0 ? Math.round((stats.wins / totalGames) * 100) : 0;

  return (
    <Card className="shadow-lg rounded-xl">
      <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-4">
        <SwordsIcon className="w-6 h-6 text-primary" />
        <CardTitle className="font-semibold">Your Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 text-center mb-6">
          <div>
            <p className="text-2xl font-bold text-green-500">{stats.wins}</p>
            <p className="text-sm text-muted-foreground">Wins</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-red-500">{stats.losses}</p>
            <p className="text-sm text-muted-foreground">Losses</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-500">{stats.draws}</p>
            <p className="text-sm text-muted-foreground">Draws</p>
          </div>
        </div>
        <Separator className="my-4" />
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-muted-foreground">Win Rate</span>
          <span className="text-sm font-bold text-green-500">{winRate}%</span>
        </div>
        <Progress value={winRate} className="mt-2 h-2" />
      </CardContent>
    </Card>
  );
}