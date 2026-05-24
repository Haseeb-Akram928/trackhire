import React from "react";
import Link from "next/link";
import { AlertCircle, Home } from "lucide-react";
import { Button } from "@/components/ui/Button/Button";

export default function DashboardNotFound() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "calc(100vh - 180px)",
        padding: "24px",
      }}
    >
      <div
        style={{
          maxWidth: "420px",
          width: "100%",
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          padding: "32px 24px",
          textAlign: "center",
          boxShadow: "var(--shadow-md)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          animation: "scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        }}
      >
        <div
          style={{
            width: "52px",
            height: "52px",
            borderRadius: "50%",
            background: "rgba(245, 158, 11, 0.08)",
            border: "1px solid rgba(245, 158, 11, 0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--status-interview)",
            marginBottom: "20px",
          }}
        >
          <AlertCircle size={24} />
        </div>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.15rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "8px" }}>
          Resource Not Found
        </h3>
        <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: "24px" }}>
          The dashboard resource or panel you are trying to access does not exist or has been moved.
        </p>

        <Link href="/dashboard" passHref style={{ textDecoration: "none", width: "100%", maxWidth: "160px" }}>
          <Button variant="primary" icon={<Home size={14} />} style={{ width: "100%" }}>
            Go to Pipeline
          </Button>
        </Link>
      </div>
    </div>
  );
}
