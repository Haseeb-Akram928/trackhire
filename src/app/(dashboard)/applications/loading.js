import React from "react";
import styles from "../loading.module.css";

export default function ApplicationsLoading() {
  return (
    <div className={styles.container}>
      <header className={styles.headerSkeleton}>
        <div>
          <div className={`${styles.titlePlaceholder} ${styles.shimmer}`} />
          <div className={`${styles.subtitlePlaceholder} ${styles.shimmer}`} />
        </div>
        <div className={`${styles.btnPlaceholder} ${styles.shimmer}`} />
      </header>

      {/* Table skeleton structure */}
      <div className={styles.tableSkeleton}>
        <div className={styles.tableHeaderSkeleton} />
        {Array.from({ length: 6 }).map((_, rowIndex) => (
          <div key={rowIndex} className={styles.tableRowSkeleton}>
            <div className={`${styles.tableCellPlaceholder} ${styles.shimmer}`} style={{ width: "20%" }} />
            <div className={`${styles.tableCellPlaceholder} ${styles.shimmer}`} style={{ width: "25%" }} />
            <div className={`${styles.tableCellPlaceholder} ${styles.shimmer}`} style={{ width: "12%" }} />
            <div className={`${styles.tableCellPlaceholder} ${styles.shimmer}`} style={{ width: "10%" }} />
            <div className={`${styles.tableCellPlaceholder} ${styles.shimmer}`} style={{ width: "15%" }} />
            <div className={`${styles.tableCellPlaceholder} ${styles.shimmer}`} style={{ width: "18%" }} />
          </div>
        ))}
      </div>
    </div>
  );
}
