import React from "react";
import styles from "./Badge.module.css";

export function Badge({ children, value, type = "status", className = "" }) {
  const normalizedValue = value ? value.toLowerCase() : "";

  return (
    <span
      className={`${styles.badge} ${styles[type]} ${styles[normalizedValue] || ""} ${className}`}
    >
      {children || value}
    </span>
  );
}
