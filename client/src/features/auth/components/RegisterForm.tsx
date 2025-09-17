import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function RegisterForm() {
  return (
    <>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="new-username">Choose Username</Label>
          <Input id="new-username" type="text" placeholder="Create a unique username" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="new-password">Create Password</Label>
          <Input id="new-password" type="password" required />
        </div>
         <div className="space-y-2">
          <Label htmlFor="confirm-password">Confirm Password</Label>
          <Input id="confirm-password" type="password" required />
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full font-semibold" type="submit">Join Game</Button>
      </CardFooter>
    </>
  );
}