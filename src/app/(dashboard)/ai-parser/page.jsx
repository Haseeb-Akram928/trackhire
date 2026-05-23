import React from "react";
import { Sparkles, FileText } from "lucide-react";
import { Button } from "@/components/ui/Button/Button";
import { Input } from "@/components/ui/Input/Input";

export const metadata = {
  title: "AI Job Parser | TrackHire",
  description: "Extract job details from descriptions and match against your resume.",
};

export default function AiParserPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px", animation: "fadeIn 0.3s ease-out" }}>
      <header>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 800 }}>AI Job Parser & Matcher</h1>
        <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", marginTop: "4px" }}>
          Paste a job description and let AI extract position details, salaries, and calculate your resume match score.
        </p>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "32px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
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
            <h2 style={{ fontSize: "1.1rem", fontWeight: 600 }}>Job Description</h2>
            <Input
              type="textarea"
              placeholder="Paste the job posting description here (requirements, role, about company)..."
              style={{ minHeight: "220px" }}
            />
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <input type="checkbox" id="compare" style={{ width: "16px", height: "16px" }} />
              <label htmlFor="compare" style={{ fontSize: "0.9rem", color: "var(--text-secondary)", cursor: "pointer" }}>
                Compare qualifications against my primary resume
              </label>
            </div>
            <Button icon={<Sparkles size={18} />} style={{ width: "100%" }}>
              Analyze Job Posting
            </Button>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-lg)",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "350px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                background: "var(--bg-secondary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--text-tertiary)",
              }}
            >
              <FileText size={22} />
            </div>
            <h3 style={{ fontWeight: 600 }}>No Analysis Done</h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-tertiary)", maxWidth: "250px" }}>
              Paste a job description on the left and run analysis to populate results.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
