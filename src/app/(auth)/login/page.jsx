import React from "react";
import { LoginForm } from "@/features/auth/LoginForm";

export const metadata = {
  title: "Sign In | TrackHire",
  description: "Sign in to your TrackHire account to manage your applications pipeline.",
};

export default function LoginPage() {
  return <LoginForm />;
}
