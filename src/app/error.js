"use client";

import React, { useEffect } from "react";
import { ShieldAlert, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button/Button";
import "@/styles/globals.css";

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error("Global crash occurred:", error);
  }, [error]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "var(--bg-primary)",
        color: "var(--text-primary)",
        fontFamily: "var(--font-sans)",
        padding: "24px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          maxWidth: "460px",
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          padding: "40px 32px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        <div
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            background: "rgba(239, 68, 68, 0.08)",
            border: "1px solid rgba(239, 68, 68, 0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--status-rejected)",
            marginBottom: "24px",
          }}
        >
          <ShieldAlert size={30} />
        </div>
        <h2 style={{ fontSize: "1.45rem", fontWeight: 700, marginBottom: "12px", fontFamily: "var(--font-display)" }}>
          Application Error
        </h2>
        <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "24px" }}>
          A fatal crash occurred in the core application logic. Please reload the tab or check back in a few minutes.
        </p>

        {error?.message && (
          <div
            style={{
              fontFamily: "monospace",
              fontSize: "0.75rem",
              background: "var(--bg-secondary)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-sm)",
              padding: "10px 14px",
              width: "100%",
              textAlign: "left",
              maxHeight: "120px",
              overflowY: "auto",
              color: "var(--text-tertiary)",
              marginBottom: "28px",
              wordBreak: "break-all",
            }}
          >
            {error.message}
          </div>
        )}

        <Button
          variant="primary"
          icon={<RotateCcw size={16} />}
          onClick={() => reset()}
          style={{ width: "100%" }}
        >
          Reload Interface
        </Button>
      </div>
    </div>
  );
}
