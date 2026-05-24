"use client";

import React from "react";
import { StatsCards } from "./StatsCards/StatsCards";
import { StatusChart } from "./StatusChart/StatusChart";
import { TimelineChart } from "./TimelineChart/TimelineChart";
import { ResponseRateChart } from "./ResponseRateChart/ResponseRateChart";
import styles from "./AnalyticsClient.module.css";

export function AnalyticsClient({ stats }) {
  return (
    <div className={styles.content}>
      <StatsCards
        total={stats.total}
        interviewRate={stats.interviewRate}
        offerRate={stats.offerRate}
        activeThisWeek={stats.activeThisWeek}
      />

      <div className={styles.chartsGrid}>
        <div className={styles.chartCard}>
          <TimelineChart data={stats.timelineData} />
        </div>
        <div className={styles.chartCard}>
          <StatusChart data={stats.statusDistribution} />
        </div>
      </div>

      <div className={styles.chartCard}>
        <ResponseRateChart data={stats.responseRateData} />
      </div>
    </div>
  );
}
