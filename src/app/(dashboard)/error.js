"use client";

import React, { useEffect } from "react";
import { AlertOctagon, RotateCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/Button/Button";
import Link from "next/link";
import styles from "./error.module.css";

export default function DashboardError({ error, reset }) {
  useEffect(() => {
    // Log the error to an analytics or error tracking service
    console.error("Dashboard render error boundary caught:", error);
  }, [error]);

  return (
    <div className={styles.container}>
      <div className={styles.errorCard}>
        <div className={styles.iconWrapper}>
          <AlertOctagon size={32} />
        </div>
        <h2 className={styles.title}>Something went wrong</h2>
        <p className={styles.description}>
          An unexpected error occurred while loading this page. Our team has been notified.
        </p>

        {error?.message && (
          <div className={styles.errorCode}>
            <strong>Details:</strong> {error.message}
          </div>
        )}

        <div className={styles.actions}>
          <Button
            variant="primary"
            icon={<RotateCcw size={16} />}
            onClick={() => reset()}
          >
            Try Again
          </Button>
          <Link href="/" passHref style={{ textDecoration: "none" }}>
            <Button variant="ghost" icon={<Home size={16} />}>
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
