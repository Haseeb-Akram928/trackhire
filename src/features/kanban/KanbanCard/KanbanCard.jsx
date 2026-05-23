"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MapPin, Calendar, Building, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/Badge/Badge";
import { timeAgo } from "@/utils/helpers";
import styles from "./KanbanCard.module.css";

export function KanbanCard({ application, onClick }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: application.id,
    data: {
      type: "Application",
      application,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : undefined,
  };

  const handleLinkClick = (e) => {
    e.stopPropagation(); // Prevent opening the edit modal
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${styles.card} ${isDragging ? styles.dragging : ""}`}
      onClick={() => onClick(application)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.stopPropagation();
          onClick(application);
        }
      }}
      {...attributes}
      {...listeners}
    >
      <div className={styles.header}>
        <span className={styles.company} title={application.company}>
          <Building size={14} className={styles.iconInline} />
          {application.company}
        </span>
        {application.job_url && (
          <a
            href={application.job_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleLinkClick}
            className={styles.linkIcon}
            title="View original posting"
          >
            <ExternalLink size={13} />
          </a>
        )}
      </div>

      <h4 className={styles.position} title={application.position}>
        {application.position}
      </h4>

      <div className={styles.metaRow}>
        {application.location ? (
          <span className={styles.metaItem}>
            <MapPin size={12} />
            {application.location}
          </span>
        ) : (
          <span className={styles.metaItemPlaceholder}>No location</span>
        )}
        
        {application.applied_at && (
          <span className={styles.metaItem} title={`Applied on ${application.applied_at}`}>
            <Calendar size={12} />
            {timeAgo(application.applied_at)}
          </span>
        )}
      </div>

      <div className={styles.footer}>
        <Badge type="priority" value={application.priority || "medium"} />
        {application.job_type && (
          <span className={styles.jobTypeBadge}>
            {application.job_type.replace("-", " ")}
          </span>
        )}
      </div>
    </div>
  );
}
