import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, useActionData, useNavigation } from "react-router-dom";

export function LoginForm() {
  const actionData = useActionData() as { error?: string };
  const navigation = useNavigation();

  return (
    <Form method="post" className="contents" replace>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input id="username" name="username" type="text" placeholder="Enter your username" required autoComplete="username" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" placeholder="Enter your password" required autoComplete="current-password" />
        </div>
        {actionData?.error && (
          <div className="text-red-600 text-sm">{actionData.error}</div>
        )}
      </CardContent>
      <CardFooter>
        <Button className="w-full font-semibold" type="submit" disabled={navigation.state === "submitting"}>
          {navigation.state === "submitting" ? "Logging in..." : "Enter Game"}
        </Button>
      </CardFooter>
    </Form>
  );
}