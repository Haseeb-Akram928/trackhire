import React from "react";
import Link from "next/link";
import { HelpCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button/Button";
import "@/styles/globals.css";

export default function NotFound() {
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
          animation: "scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        }}
      >
        <div
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            background: "rgba(99, 102, 241, 0.08)",
            border: "1px solid rgba(99, 102, 241, 0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--accent)",
            marginBottom: "24px",
          }}
        >
          <HelpCircle size={30} />
        </div>
        <h2 style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: "8px", fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
          404
        </h2>
        <h3 style={{ fontSize: "1.2rem", fontWeight: 600, marginBottom: "12px", color: "var(--text-secondary)" }}>
          Page Not Found
        </h3>
        <p style={{ fontSize: "0.95rem", color: "var(--text-tertiary)", lineHeight: 1.6, marginBottom: "28px" }}>
          The page you are looking for does not exist, has been removed, or has changed address.
        </p>

        <Link href="/" passHref style={{ textDecoration: "none", width: "100%" }}>
          <Button
            variant="primary"
            icon={<ArrowLeft size={16} />}
            style={{ width: "100%" }}
          >
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
