import React from "react";
import { BarChart3, TrendingUp, Award, Clock } from "lucide-react";

export const metadata = {
  title: "Job Analytics | TrackHire",
  description: "View key search metrics, response rates, and application trends over time.",
};

export default function AnalyticsPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px", animation: "fadeIn 0.3s ease-out" }}>
      <header>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 800 }}>Search Analytics</h1>
        <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", marginTop: "4px" }}>
          Gain insights into your job hunting process with automated metric evaluations.
        </p>
      </header>

      {/* Stats Cards Row Teaser */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
        {[
          { label: "Total Applications", value: "0", sub: "All time", icon: BarChart3 },
          { label: "Interview Rate", value: "0%", sub: "Wishlist excluded", icon: TrendingUp },
          { label: "Offer Rate", value: "0%", sub: "Total wins", icon: Award },
          { label: "Active This Week", value: "0", sub: "Last 7 days", icon: Clock },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-lg)",
                padding: "20px 24px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: 500 }}>
                  {stat.label}
                </span>
                <span style={{ color: "var(--accent)" }}>
                  <Icon size={18} />
                </span>
              </div>
              <div>
                <span style={{ fontSize: "1.75rem", fontWeight: 700, fontFamily: "var(--font-display)" }}>
                  {stat.value}
                </span>
                <p style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", marginTop: "2px" }}>
                  {stat.sub}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Grid for Charts */}
      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "24px", minHeight: "300px" }}>
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)",
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            color: "var(--text-tertiary)",
            fontSize: "0.9rem",
          }}
        >
          Timeline Chart Placeholder (Recharts area graph)
        </div>
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)",
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            color: "var(--text-tertiary)",
            fontSize: "0.9rem",
          }}
        >
          Status Distribution Placeholder (Recharts pie chart)
        </div>
      </div>
    </div>
  );
}
