import { SignInButton } from "@/components/auth/SignInButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Use GitHub to access MaintainOps.
          </p>
          <SignInButton />
        </CardContent>
      </Card>
    </main>
  );
}
