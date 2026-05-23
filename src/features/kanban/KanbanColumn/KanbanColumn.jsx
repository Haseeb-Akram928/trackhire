"use client";

import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Plus, Inbox } from "lucide-react";
import { Badge } from "@/components/ui/Badge/Badge";
import { KanbanCard } from "../KanbanCard/KanbanCard";
import styles from "./KanbanColumn.module.css";

export function KanbanColumn({ status, applications = [], onCardClick, onAddClick }) {
  const { setNodeRef, isOver } = useDroppable({
    id: status.id,
    data: {
      type: "Column",
      statusId: status.id,
    },
  });

  const cardIds = applications.map((app) => app.id);

  return (
    <div className={styles.column}>
      {/* Column Header */}
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <span
            className={styles.statusDot}
            style={{ backgroundColor: status.color }}
          />
          <h3 className={styles.title}>{status.label}</h3>
          <Badge type="status" value={status.id} className={styles.countBadge}>
            {applications.length}
          </Badge>
        </div>
        
        <button
          onClick={() => onAddClick(status.id)}
          className={styles.addBtnHeader}
          title={`Add application to ${status.label}`}
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Cards List Area */}
      <div
        ref={setNodeRef}
        className={`${styles.cardList} ${isOver ? styles.columnHovered : ""}`}
      >
        {applications.length > 0 ? (
          <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
            <div className={styles.cardsContainer}>
              {applications.map((app) => (
                <KanbanCard key={app.id} application={app} onClick={onCardClick} />
              ))}
            </div>
          </SortableContext>
        ) : (
          <div className={styles.emptyState}>
            <Inbox size={20} className={styles.emptyIcon} />
            <p className={styles.emptyText}>No applications</p>
          </div>
        )}
      </div>

      {/* Column Footer Action */}
      <button onClick={() => onAddClick(status.id)} className={styles.addCardBtn}>
        <Plus size={14} />
        <span>Add Job Application</span>
      </button>
    </div>
  );
}
