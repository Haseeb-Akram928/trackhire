import React from "react";
import styles from "../loading.module.css";

export default function DashboardLoading() {
  return (
    <div className={styles.container}>
      <header className={styles.headerSkeleton}>
        <div>
          <div className={`${styles.titlePlaceholder} ${styles.shimmer}`} />
          <div className={`${styles.subtitlePlaceholder} ${styles.shimmer}`} />
        </div>
        <div className={`${styles.btnPlaceholder} ${styles.shimmer}`} />
      </header>

      <div className={styles.dashboardGrid}>
        {/* Kanban Board Column Skeletons */}
        <div className={styles.boardSkeleton}>
          {Array.from({ length: 4 }).map((_, colIndex) => (
            <div key={colIndex} className={styles.columnSkeleton}>
              <div className={`${styles.columnHeaderPlaceholder} ${styles.shimmer}`} />
              {Array.from({ length: colIndex === 0 ? 3 : colIndex === 1 ? 2 : 1 }).map((_, cardIndex) => (
                <div key={cardIndex} className={`${styles.cardSkeleton} ${styles.shimmer}`} />
              ))}
            </div>
          ))}
        </div>

        {/* Activity Sidebar Skeleton */}
        <div className={styles.activitySidebarSkeleton}>
          <div className={`${styles.activityTitlePlaceholder} ${styles.shimmer}`} />
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "12px" }}>
            {Array.from({ length: 5 }).map((_, actIndex) => (
              <div key={actIndex} className={styles.activityItemPlaceholder}>
                <div className={`${styles.activityIconPlaceholder} ${styles.shimmer}`} />
                <div className={styles.activityTextPlaceholder}>
                  <div className={`${styles.activityTextLine1} ${styles.shimmer}`} />
                  <div className={`${styles.activityTextLine2} ${styles.shimmer}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
