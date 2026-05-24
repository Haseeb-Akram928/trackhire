import { createClient } from "@/lib/supabase/server";
import LandingClient from "./LandingClient";

export const metadata = {
  title: "TrackHire | AI-Powered Job Search Pipeline & Tracker",
  description:
    "Organize your job hunt with a stunning Kanban pipeline, AI-powered job matching, resume parsing, and real-time analytics — all in one place.",
};

export default async function LandingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <LandingClient isLoggedIn={!!user} />;
}
