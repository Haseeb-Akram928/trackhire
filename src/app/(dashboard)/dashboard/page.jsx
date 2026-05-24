import React from "react";
import { DashboardView } from "@/features/dashboard/DashboardView";

export const metadata = {
  title: "Application Pipeline | TrackHire",
  description: "Track your job applications and visualize your hiring pipeline with an interactive Kanban board.",
};

export default function DashboardPage() {
  return <DashboardView />;
}
