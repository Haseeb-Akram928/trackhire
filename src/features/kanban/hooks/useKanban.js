"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { STATUSES, POSITION_GAP } from "@/utils/constants";
import { useApplicationMutations } from "../../applications/hooks/useApplicationMutations";

// When the gap between adjacent position_index values falls below this
// threshold, the entire column is re-indexed with fresh POSITION_GAP spacing
// to prevent ordering collisions from repeated midpoint insertions. (#2)
const REINDEX_THRESHOLD = 10;

export function useKanban(initialApplications, onStateChange, onDragComplete) {
  const [apps, setApps] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [activeApp, setActiveApp] = useState(null);
  const { updateApplication, batchUpdatePositions } = useApplicationMutations();

  // Refs to avoid stale closures in drag handlers (#4, #5)
  const appsRef = useRef([]);
  const previousAppsRef = useRef([]);

  // Sync state with parent data fetch
  useEffect(() => {
    setApps(initialApplications || []);
  }, [initialApplications]);

  // Keep appsRef always current so handlers can read latest state without
  // depending on `apps` in their useCallback dependency arrays
  useEffect(() => {
    appsRef.current = apps;
  }, [apps]);

  // Group applications by status column
  const columnsData = useMemo(() => {
    const columns = {};
    STATUSES.forEach((status) => {
      columns[status.id] = [];
    });

    apps.forEach((app) => {
      if (columns[app.status]) {
        columns[app.status].push(app);
      } else {
        // Fallback for unknown status
        columns["wishlist"] = columns["wishlist"] || [];
        columns["wishlist"].push(app);
      }
    });

    // Ensure each column's cards are sorted by position_index ascending
    Object.keys(columns).forEach((statusId) => {
      columns[statusId].sort((a, b) => (a.position_index || 0) - (b.position_index || 0));
    });

    return columns;
  }, [apps]);

  const handleDragStart = useCallback((event) => {
    const { active } = event;
    setActiveId(active.id);

    // Capture pre-drag snapshot for rollback before any handleDragOver mutations (#5)
    previousAppsRef.current = [...appsRef.current];

    const draggedApp = appsRef.current.find((app) => app.id === active.id);
    setActiveApp(draggedApp || null);
  }, []);

  // Uses functional setApps to avoid stale closure on `apps` (#4)
  const handleDragOver = useCallback((event) => {
    const { active, over } = event;
    if (!over) return;

    const activeIdVal = active.id;
    const overIdVal = over.id;

    if (activeIdVal === overIdVal) return;

    setApps((prevApps) => {
      const activeAppObj = prevApps.find((a) => a.id === activeIdVal);
      if (!activeAppObj) return prevApps;

      const activeStatus = activeAppObj.status;

      // Determine target column
      let overStatus = null;
      const overAppObj = prevApps.find((a) => a.id === overIdVal);

      if (overAppObj) {
        overStatus = overAppObj.status;
      } else {
        // Over element might be the column container itself
        const isColumn = STATUSES.some((s) => s.id === overIdVal);
        if (isColumn) overStatus = overIdVal;
      }

      if (!overStatus || activeStatus === overStatus) return prevApps;

      // Move to another column during drag hover (visual preview)
      return prevApps.map((a) => {
        if (a.id === activeIdVal) {
          return { ...a, status: overStatus };
        }
        return a;
      });
    });
  }, []);

  const handleDragEnd = useCallback(async (event) => {
    const { active, over } = event;
    setActiveId(null);
    setActiveApp(null);

    if (!over) {
      // Drag cancelled — rollback to pre-drag snapshot
      setApps(previousAppsRef.current);
      if (onStateChange) onStateChange(previousAppsRef.current);
      return;
    }

    // Read current state from ref (includes handleDragOver mutations)
    const currentApps = appsRef.current;
    const activeIdVal = active.id;
    const overIdVal = over.id;

    // Find the item that was moved — its status has already been updated
    // by handleDragOver to reflect the target column
    const movedApp = currentApps.find((a) => a.id === activeIdVal);
    if (!movedApp) return;

    const finalStatus = movedApp.status;

    // Get all apps in the target column (excluding the moved app for calculation)
    const targetColApps = currentApps
      .filter((a) => a.status === finalStatus && a.id !== activeIdVal)
      .sort((a, b) => (a.position_index || 0) - (b.position_index || 0));

    let finalIndex = POSITION_GAP;

    // Midpoint calculation for ordering
    const overAppObj = currentApps.find((a) => a.id === overIdVal);

    if (overAppObj && overAppObj.id !== activeIdVal) {
      const overIndexInCol = targetColApps.findIndex((a) => a.id === overIdVal);

      if (overIndexInCol === -1) {
        // Fallback if not found
        finalIndex = targetColApps.length > 0
          ? targetColApps[targetColApps.length - 1].position_index + POSITION_GAP
          : POSITION_GAP;
      } else {
        // Dropping relative to another card
        const currentOverApp = targetColApps[overIndexInCol];
        const prevApp = targetColApps[overIndexInCol - 1];

        if (!prevApp) {
          // Drop at the beginning of the column
          finalIndex = currentOverApp.position_index / 2;
        } else {
          // Drop between prevApp and currentOverApp
          finalIndex = (prevApp.position_index + currentOverApp.position_index) / 2;
        }
      }
    } else {
      // Dropping onto the column empty slot or at the end
      if (targetColApps.length > 0) {
        finalIndex = targetColApps[targetColApps.length - 1].position_index + POSITION_GAP;
      } else {
        finalIndex = POSITION_GAP;
      }
    }

    finalIndex = Math.round(finalIndex);

    // Check if re-indexing is needed — gap too small between adjacent cards (#2)
    const hypotheticalCol = [...targetColApps, { id: activeIdVal, position_index: finalIndex }]
      .sort((a, b) => a.position_index - b.position_index);

    let needsReindex = false;
    if (hypotheticalCol.length > 0 && hypotheticalCol[0].position_index < REINDEX_THRESHOLD) {
      needsReindex = true;
    }
    for (let i = 1; i < hypotheticalCol.length && !needsReindex; i++) {
      const gap = hypotheticalCol[i].position_index - hypotheticalCol[i - 1].position_index;
      if (gap < REINDEX_THRESHOLD) {
        needsReindex = true;
      }
    }

    // Apply optimistic update locally
    const updatedApps = currentApps.map((a) => {
      if (a.id === activeIdVal) {
        return {
          ...a,
          status: finalStatus,
          position_index: finalIndex,
        };
      }
      return a;
    });

    setApps(updatedApps);
    if (onStateChange) onStateChange(updatedApps);

    // Save to Supabase
    try {
      await updateApplication(activeIdVal, {
        status: finalStatus,
        position_index: finalIndex,
      });

      // Re-index entire column if gaps have degraded below threshold
      if (needsReindex) {
        const allColApps = updatedApps
          .filter((a) => a.status === finalStatus)
          .sort((a, b) => (a.position_index || 0) - (b.position_index || 0));

        const reindexUpdates = allColApps.map((app, i) => ({
          id: app.id,
          position_index: (i + 1) * POSITION_GAP,
        }));

        await batchUpdatePositions(reindexUpdates);

        // Apply re-indexed positions locally
        setApps((prev) =>
          prev.map((a) => {
            const reindexed = reindexUpdates.find((u) => u.id === a.id);
            return reindexed ? { ...a, position_index: reindexed.position_index } : a;
          })
        );
      }

      // Only refresh activity feed, not applications — trust the optimistic state (#7)
      if (onDragComplete) onDragComplete();
    } catch (err) {
      console.error("Failed to persist card move, rolling back:", err);
      // Rollback to pre-drag snapshot captured in handleDragStart (#5)
      setApps(previousAppsRef.current);
      if (onStateChange) onStateChange(previousAppsRef.current);
    }
  }, [updateApplication, batchUpdatePositions, onStateChange, onDragComplete]);

  return {
    columnsData,
    activeId,
    activeApp,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  };
}
