import { AwardIcon, UsersIcon, ZapIcon } from "@/components/icons/FeatureIcons";
import { TrophyIcon } from "@/components/icons/TrophyIcon";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "../components/LoginForm";
import { RegisterForm } from "../components/RegisterForm";

export function AuthPage() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center bg-primary text-primary-foreground p-4 rounded-full mb-4 shadow-lg">
          <TrophyIcon className="h-10 w-10" />
        </div>
        <h1 className="text-5xl font-bold text-gray-800">
          Tic Tac Pro
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Challenge players worldwide in the ultimate tic-tac-toe experience
        </p>
      </div>

      <div className="flex items-center justify-center space-x-12 mb-12 text-muted-foreground">
        <div className="flex flex-col items-center space-y-2">
          <UsersIcon className="h-8 w-8 text-primary" />
          <span className="font-medium">Multiplayer</span>
        </div>
        <div className="flex flex-col items-center space-y-2">
          <ZapIcon className="h-8 w-8 text-primary" />
          <span className="font-medium">Real-time</span>
        </div>
        <div className="flex flex-col items-center space-y-2">
          <AwardIcon className="h-8 w-8 text-primary" />
          <span className="font-medium">Competitive</span>
        </div>
      </div>

      <Tabs defaultValue="login" className="w-full max-w-md">
        <Card className="shadow-2xl rounded-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Join the Game</CardTitle>
            <CardDescription>Enter your details to start playing</CardDescription>
          </CardHeader>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <LoginForm />
          </TabsContent>
          <TabsContent value="register">
            <RegisterForm />
          </TabsContent>
        </Card>
      </Tabs>
    </div>
  );
}