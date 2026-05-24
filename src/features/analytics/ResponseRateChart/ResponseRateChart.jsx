"use client";

import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import styles from "../Chart.module.css";

export function ResponseRateChart({ data = [] }) {
  const customTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className={styles.tooltip}>
          <p className={styles.tooltipTitle}>Application Outcomes</p>
          <div className={styles.tooltipItems}>
            {payload.map((item, index) => (
              <span key={index} className={styles.tooltipItem}>
                {item.name}: <span className={styles.tooltipValue} style={{ color: item.color }}>{item.value}</span>
              </span>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.heading}>Response Outcomes Breakdown</h3>
      {data.length === 0 || (data[0] && data[0].Responded === 0 && data[0].Rejected === 0 && data[0].Ghosted === 0 && data[0].Applied === 0) ? (
        <div className={styles.emptyState}>
          No application status details available
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="90%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -24, bottom: 0 }}>
            <CartesianGrid stroke="rgba(255, 255, 255, 0.03)" vertical={false} />
            <XAxis
              dataKey="name"
              stroke="var(--text-tertiary)"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              dy={8}
            />
            <YAxis
              stroke="var(--text-tertiary)"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              dx={-8}
            />
            <Tooltip content={customTooltip} />
            <Legend
              iconType="circle"
              iconSize={8}
              formatter={(value) => (
                <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{value}</span>
              )}
            />
            {/* Outbox / Wishlist is skipped. Outcomes only */}
            <Bar dataKey="Responded" name="Interviews/Offers" fill="var(--status-offer)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Applied" name="Applied (Pending)" fill="var(--status-applied)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Ghosted" name="Ghosted" fill="var(--status-ghosted)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Rejected" name="Rejected" fill="var(--status-rejected)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
