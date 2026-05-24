"use client";

import React from "react";
import { MapPin, Calendar, Building, ExternalLink, Banknote, Briefcase } from "lucide-react";
import { Badge } from "@/components/ui/Badge/Badge";
import { timeAgo, formatSalaryRange } from "@/utils/helpers";
import styles from "./ApplicationCard.module.css";

export function ApplicationCard({ application, onClick, compact = false }) {
  return (
    <div
      className={`${styles.card} ${compact ? styles.compact : ""}`}
      onClick={() => onClick?.(application)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.(application);
        }
      }}
    >
      <div className={styles.header}>
        <span className={styles.company}>
          <Building size={14} className={styles.iconInline} />
          {application.company}
        </span>
        <div className={styles.headerActions}>
          <Badge type="status" value={application.status} />
          {application.job_url && (
            <a
              href={application.job_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className={styles.linkIcon}
              title="View original posting"
            >
              <ExternalLink size={13} />
            </a>
          )}
        </div>
      </div>

      <h4 className={styles.position}>{application.position}</h4>

      <div className={styles.metaRow}>
        {application.location && (
          <span className={styles.metaItem}>
            <MapPin size={12} />
            {application.location}
          </span>
        )}
        {application.job_type && (
          <span className={styles.metaItem}>
            <Briefcase size={12} />
            {application.job_type.replace("-", " ")}
          </span>
        )}
        {(application.salary_min || application.salary_max) && (
          <span className={styles.metaItem}>
            <Banknote size={12} />
            {formatSalaryRange(application.salary_min, application.salary_max, application.location)}
          </span>
        )}
      </div>

      <div className={styles.footer}>
        <Badge type="priority" value={application.priority || "medium"} />
        {application.applied_at && (
          <span className={styles.dateInfo}>
            <Calendar size={12} />
            {timeAgo(application.applied_at)}
          </span>
        )}
      </div>
    </div>
  );
}
