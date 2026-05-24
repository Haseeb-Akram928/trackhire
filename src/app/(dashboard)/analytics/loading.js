import React from "react";
import styles from "../loading.module.css";

export default function AnalyticsLoading() {
  return (
    <div className={styles.container}>
      <header className={styles.headerSkeleton}>
        <div>
          <div className={`${styles.titlePlaceholder} ${styles.shimmer}`} />
          <div className={`${styles.subtitlePlaceholder} ${styles.shimmer}`} />
        </div>
      </header>

      {/* Metrics Row Skeleton */}
      <div className={styles.statsGridSkeleton}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className={`${styles.statCardSkeleton} ${styles.shimmer}`} />
        ))}
      </div>

      {/* Charts Grid Skeleton */}
      <div className={styles.chartsGridSkeleton}>
        <div className={`${styles.chartCardSkeleton} ${styles.shimmer}`} />
        <div className={`${styles.chartCardSkeleton} ${styles.shimmer}`} />
      </div>

      <div className={`${styles.chartCardSkeleton} ${styles.shimmer}`} />
    </div>
  );
}
