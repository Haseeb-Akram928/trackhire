import React from "react";
import { createClient } from "@/lib/supabase/server";
import { computeStats } from "@/features/analytics/computeStats";
import { AnalyticsClient } from "@/features/analytics/AnalyticsClient";
import { AlertCircle } from "lucide-react";
import styles from "./AnalyticsPage.module.css";

export const metadata = {
  title: "Search Analytics | TrackHire",
  description: "Gain insights into your job hunt pipeline metrics, response rates, and application trends.",
};

export default async function AnalyticsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let stats = null;
  let fetchError = null;

  if (user) {
    try {
      const { data, error } = await supabase
        .from("applications")
        .select("*")
        .eq("user_id", user.id);

      if (error) throw error;
      stats = computeStats(data);
    } catch (err) {
      console.error("Failed to load analytics data:", err);
      fetchError = err.message;
    }
  }

  return (
    <div className={styles.container}>
      <header>
        <h1 className={styles.title}>Search Analytics</h1>
        <p className={styles.subtitle}>
          Gain insights into your job hunt pipeline metrics, response rates, and application trends.
        </p>
      </header>

      {fetchError ? (
        <div className={styles.errorBanner}>
          <AlertCircle size={20} />
          <p className={styles.errorText}>Error loading search analytics: {fetchError}</p>
        </div>
      ) : (
        <AnalyticsClient stats={stats || { total: 0, interviewRate: 0, offerRate: 0, activeThisWeek: 0, statusDistribution: [], timelineData: [], responseRateData: [] }} />
      )}
    </div>
  );
}
