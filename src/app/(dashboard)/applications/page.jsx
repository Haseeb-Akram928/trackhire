import React from "react";
import { Table, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button/Button";
import { EmptyState } from "@/components/ui/EmptyState/EmptyState";

export const metadata = {
  title: "Applications List | TrackHire",
  description: "View all your job applications in a detailed tabular format.",
};

export default function ApplicationsPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", animation: "fadeIn 0.3s ease-out" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 800 }}>Applications List</h1>
          <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)" }}>Table view of all your job applications.</p>
        </div>
        <Button icon={<Plus size={18} />}>Add Application</Button>
      </header>

      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          padding: "40px 24px",
          minHeight: "400px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <EmptyState
          icon={<Table size={24} />}
          title="No Applications Found"
          description="You haven't tracked any job applications yet. Click 'Add Application' above or visit the AI Parser to get started."
          action={<Button icon={<Plus size={16} />} variant="secondary">Add Application</Button>}
        />
      </div>
    </div>
  );
}
