"use client";

import React from "react";
import { BarChart3, TrendingUp, Award, Clock } from "lucide-react";
import styles from "./StatsCards.module.css";

export function StatsCards({ total, interviewRate, offerRate, activeThisWeek }) {
  const cards = [
    {
      label: "Total Applications",
      value: total,
      sub: "Tracked jobs",
      icon: <BarChart3 size={18} />,
      colorClass: styles.blueIcon,
    },
    {
      label: "Interview Rate",
      value: `${interviewRate}%`,
      sub: "Wishlist excluded",
      icon: <TrendingUp size={18} />,
      colorClass: styles.amberIcon,
    },
    {
      label: "Offer Rate",
      value: `${offerRate}%`,
      sub: "Overall win rate",
      icon: <Award size={18} />,
      colorClass: styles.greenIcon,
    },
    {
      label: "Active This Week",
      value: activeThisWeek,
      sub: "Applied past 7 days",
      icon: <Clock size={18} />,
      colorClass: styles.purpleIcon,
    },
  ];

  return (
    <div className={styles.grid}>
      {cards.map((card, idx) => (
        <div key={idx} className={styles.card}>
          <div className={styles.header}>
            <span className={styles.label}>{card.label}</span>
            <span className={`${styles.iconWrapper} ${card.colorClass}`}>
              {card.icon}
            </span>
          </div>
          <div className={styles.body}>
            <span className={styles.value}>{card.value}</span>
            <span className={styles.subtitle}>{card.sub}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
