import React from "react";
import styles from "./Loader.module.css";

export function Loader({ size = "md", className = "" }) {
  return (
    <div className={`${styles.spinner} ${styles[size]} ${className}`} aria-label="Loading">
      <div className={styles.ring}></div>
    </div>
  );
}
