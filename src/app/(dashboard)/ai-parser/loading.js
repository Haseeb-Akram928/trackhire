import React from "react";
import styles from "../loading.module.css";

export default function AiParserLoading() {
  return (
    <div className={styles.container}>
      <header className={styles.headerSkeleton}>
        <div>
          <div className={`${styles.titlePlaceholder} ${styles.shimmer}`} />
          <div className={`${styles.subtitlePlaceholder} ${styles.shimmer}`} />
        </div>
      </header>

      {/* Workspace columns */}
      <div className={styles.parserLayoutSkeleton}>
        <div
          className={`${styles.settingsCardSkeleton} ${styles.shimmer}`}
          style={{ height: "450px" }}
        />
        <div
          className={`${styles.settingsCardSkeleton} ${styles.shimmer}`}
          style={{ height: "450px" }}
        />
      </div>
    </div>
  );
}
