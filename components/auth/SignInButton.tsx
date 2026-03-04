"use client";

import { signIn } from "next-auth/react";
import { Button } from "../ui/button";

export function SignInButton() {
  return (
    <Button
      className="w-full"
      onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
    >
      Continue with Github
    </Button>
  );
}
