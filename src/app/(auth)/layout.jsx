import React from "react";
import Link from "next/link";

export default function AuthLayout({ children }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "24px",
        background: "radial-gradient(circle at top right, hsl(250, 85%, 15%) 0%, var(--bg-primary) 60%)",
        position: "relative",
      }}
    >
      <header style={{ marginBottom: "32px", textAlign: "center", zIndex: 10 }}>
        <Link
          href="/"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "2rem",
            fontWeight: "800",
            letterSpacing: "-0.03em",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span
            style={{
              background: "linear-gradient(135deg, hsl(250, 85%, 65%) 0%, hsl(280, 85%, 60%) 100%)",
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: "900",
              fontSize: "1.25rem",
              boxShadow: "0 4px 12px hsla(250, 85%, 65%, 0.4)",
            }}
          >
            T
          </span>
          <span className="gradient-text">TrackHire</span>
        </Link>
      </header>

      <main style={{ width: "100%", display: "flex", justifyContent: "center", zIndex: 10 }}>
        {children}
      </main>

      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "5%",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background: "hsla(250, 85%, 65%, 0.05)",
          filter: "blur(80px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          right: "5%",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: "hsla(280, 85%, 60%, 0.03)",
          filter: "blur(100px)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
