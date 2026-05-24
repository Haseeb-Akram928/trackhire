"use client";

import React from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import styles from "../Chart.module.css";

export function TimelineChart({ data = [] }) {
  const customTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className={styles.tooltip}>
          <p className={styles.tooltipTitle}>{payload[0].payload.dateStr}</p>
          <p className={styles.tooltipRow}>
            New Applications: <span className={styles.tooltipValue} style={{ color: "var(--accent)" }}>{payload[0].value}</span>
          </p>
          {payload[1] && (
            <p className={styles.tooltipRow}>
              Total Cumulative: <span className={styles.tooltipValue} style={{ color: "hsl(263, 70%, 58%)" }}>{payload[1].value}</span>
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.heading}>Application Volume Over Time</h3>
      {data.length === 0 ? (
        <div className={styles.emptyState}>
          No timeline data available. Submit applications to see trends!
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="90%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -24, bottom: 0 }}>
            <defs>
              <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.2} />
                <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorCum" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(263, 70%, 58%)" stopOpacity={0.15} />
                <stop offset="95%" stopColor="hsl(263, 70%, 58%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255, 255, 255, 0.03)" vertical={false} />
            <XAxis
              dataKey="dateStr"
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
            <Tooltip content={customTooltip} cursor={{ stroke: "rgba(255, 255, 255, 0.1)", strokeWidth: 1 }} />
            <Area
              type="monotone"
              dataKey="Applications"
              stroke="var(--accent)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorApps)"
            />
            <Area
              type="monotone"
              dataKey="Cumulative"
              stroke="hsl(263, 70%, 58%)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorCum)"
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
