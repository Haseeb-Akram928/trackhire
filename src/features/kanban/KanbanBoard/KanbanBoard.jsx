"use client";

import React, { useMemo } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { STATUSES } from "@/utils/constants";
import { KanbanColumn } from "../KanbanColumn/KanbanColumn";
import { KanbanCard } from "../KanbanCard/KanbanCard";
import { useKanban } from "../hooks/useKanban";
import styles from "./KanbanBoard.module.css";

export function KanbanBoard({
  applications = [],
  onCardClick,
  onAddClick,
  onDragComplete,
  setApplications,
}) {
  // Configure Pointer Sensor with drag activation constraints
  // This allows click handlers on cards to work without registering as a drag gesture
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require drag movement of at least 8px before starting drag
      },
    })
  );

  const {
    columnsData,
    activeId,
    activeApp,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  } = useKanban(applications, setApplications, onDragComplete);

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className={styles.boardWrapper}>
        <div className={styles.board}>
          {STATUSES.map((status) => (
            <KanbanColumn
              key={status.id}
              status={status}
              applications={columnsData[status.id] || []}
              onCardClick={onCardClick}
              onAddClick={onAddClick}
            />
          ))}
        </div>
      </div>

      {/* Drag Overlay for smooth card preview while dragging */}
      <DragOverlay dropAnimation={null}>
        {activeId && activeApp ? (
          <div className={styles.overlayCardWrapper}>
            <KanbanCard application={activeApp} onClick={() => {}} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
