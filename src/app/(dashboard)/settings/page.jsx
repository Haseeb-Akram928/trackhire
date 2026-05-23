import React from "react";
import { User, FileUp, Shield, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/Button/Button";
import { Input } from "@/components/ui/Input/Input";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Profile & Settings | TrackHire",
  description: "Manage your user profile details, upload your PDF resume, and configure account parameters.",
};

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const userEmail = user?.email || "";
  const userFullName = user?.user_metadata?.full_name || "";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px", animation: "fadeIn 0.3s ease-out" }}>
      <header>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 800 }}>Settings</h1>
        <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", marginTop: "4px" }}>
          Manage your personal details, credentials, and default resume settings.
        </p>
      </header>

      <div style={{ display: "flex", flexDirection: "column", gap: "24px", maxWidth: "650px" }}>
        {/* Profile Card */}
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)",
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px", borderBottom: "1px solid var(--border)", paddingBottom: "12px" }}>
            <User size={20} style={{ color: "var(--accent)" }} />
            <h2 style={{ fontSize: "1.1rem", fontWeight: 600 }}>Profile Details</h2>
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <Input label="Full Name" defaultValue={userFullName} placeholder="Enter your full name" />
            <Input label="Email Address" value={userEmail} disabled />
            <Button style={{ alignSelf: "flex-start" }}>Save Changes</Button>
          </div>
        </div>

        {/* Resume Card */}
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)",
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px", borderBottom: "1px solid var(--border)", paddingBottom: "12px" }}>
            <FileUp size={20} style={{ color: "var(--accent)" }} />
            <h2 style={{ fontSize: "1.1rem", fontWeight: 600 }}>Default Resume (PDF)</h2>
          </div>

          <div
            style={{
              border: "2px dashed var(--border)",
              borderRadius: "var(--radius-md)",
              padding: "32px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "12px",
              textAlign: "center",
              cursor: "pointer",
            }}
          >
            <FileUp size={32} style={{ color: "var(--text-tertiary)" }} />
            <span style={{ fontSize: "0.9rem", fontWeight: 500 }}>Upload new resume</span>
            <span style={{ fontSize: "0.75rem", color: "var(--text-tertiary)" }}>Supports PDF up to 5MB</span>
          </div>
        </div>
      </div>
    </div>
  );
}
