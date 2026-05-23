import React from "react";
import { SignupForm } from "@/features/auth/SignupForm";

export const metadata = {
  title: "Create Account | TrackHire",
  description: "Register a new TrackHire account to track your job application process.",
};

export default function SignupPage() {
  return <SignupForm />;
}
