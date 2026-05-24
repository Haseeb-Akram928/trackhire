import React from "react";
import styles from "../loading.module.css";

export default function SettingsLoading() {
  return (
    <div className={styles.container}>
      <header className={styles.headerSkeleton}>
        <div>
          <div className={`${styles.titlePlaceholder} ${styles.shimmer}`} />
          <div className={`${styles.subtitlePlaceholder} ${styles.shimmer}`} />
        </div>
      </header>

      {/* Settings layout columns */}
      <div className={styles.parserLayoutSkeleton}>
        <div className={`${styles.settingsCardSkeleton} ${styles.shimmer}`} />
        <div className={`${styles.settingsCardSkeleton} ${styles.shimmer}`} style={{ height: "300px" }} />
      </div>
    </div>
  );
}
