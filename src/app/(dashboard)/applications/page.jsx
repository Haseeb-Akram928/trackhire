import React from "react";
import { ApplicationsView } from "@/features/applications/ApplicationsView/ApplicationsView";

export const metadata = {
  title: "Applications List | TrackHire",
  description: "Detailed tabular view of your job applications with custom sorting, search, and status filters.",
};

export default function ApplicationsPage() {
  return <ApplicationsView />;
}
