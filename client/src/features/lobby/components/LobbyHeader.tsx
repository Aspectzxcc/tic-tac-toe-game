import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CrownIcon, LogOutIcon } from "@/components/icons/GameIcons";
import { Form } from "react-router-dom";

export function LobbyHeader() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userRank = "Gold";

  return (
    <header className="flex items-center justify-between w-full mb-8">
      <div className="flex items-center gap-4">
        <Avatar className="h-12 w-12 border-2 border-primary">
          <AvatarImage src={`https://api.dicebear.com/8.x/bottts/svg?seed=${user.username}`} alt="avatar" />
          <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Welcome, {user.username}</h1>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <CrownIcon className="w-4 h-4 text-yellow-500" />
            <span className="font-semibold">Rank: {userRank}</span>
          </div>
        </div>
      </div>
      <Form method="post" action="/auth/logout" replace>
        <Button variant="outline" type="submit">
          <LogOutIcon className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </Form>
    </header>
  );
}