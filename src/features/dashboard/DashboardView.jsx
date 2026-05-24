"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Plus, Clock, ArrowRightLeft, CalendarCheck, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button/Button";
import { Modal } from "@/components/ui/Modal/Modal";
import { ApplicationForm } from "@/features/applications/ApplicationForm/ApplicationForm";
import { KanbanBoard } from "@/features/kanban/KanbanBoard/KanbanBoard";
import { useApplications } from "@/features/applications/hooks/useApplications";
import { createClient } from "@/lib/supabase/client";
import { Loader } from "@/components/ui/Loader/Loader";
import { timeAgo } from "@/utils/helpers";
import styles from "@/app/(dashboard)/dashboard/DashboardPage.module.css";

export function DashboardView() {
  const { applications, loading, error, refetch, setApplications } = useApplications();
  const [activities, setActivities] = useState([]);
  const [loadingActivities, setLoadingActivities] = useState(false);

  // Modal control states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [defaultStatus, setDefaultStatus] = useState("wishlist");

  const supabase = useMemo(() => createClient(), []);

  // Fetch recent activity logs
  const fetchActivities = useCallback(async () => {
    setLoadingActivities(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error: logsError } = await supabase
        .from("activity_log")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10);

      if (logsError) throw logsError;
      setActivities(data || []);
    } catch (err) {
      console.error("Error fetching activity logs:", err);
    } finally {
      setLoadingActivities(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  // Combined reload trigger when mutation completes
  const handleMutationSuccess = () => {
    refetch();
    fetchActivities();
  };

  // Card click triggers edit modal
  const handleCardClick = (application) => {
    setSelectedApplication(application);
    setIsFormOpen(true);
  };

  // Add click triggers creation modal with column pre-fill
  const handleAddClick = (statusId = "wishlist") => {
    setSelectedApplication(null);
    setDefaultStatus(statusId);
    setIsFormOpen(true);
  };

  // Helper to render activity feed item icon
  const renderActivityIcon = (action) => {
    switch (action) {
      case "created":
        return (
          <div className={`${styles.activityIcon} ${styles.iconCreated}`}>
            <Plus size={14} />
          </div>
        );
      case "status_changed":
        return (
          <div className={`${styles.activityIcon} ${styles.iconStatus}`}>
            <ArrowRightLeft size={13} />
          </div>
        );
      case "interview_scheduled":
        return (
          <div className={`${styles.activityIcon} ${styles.iconInterview}`}>
            <CalendarCheck size={14} />
          </div>
        );
      default:
        return (
          <div className={styles.activityIcon}>
            <Clock size={14} />
          </div>
        );
    }
  };

  // Helper to format activity action texts
  const renderActivityText = (act) => {
    const details = act.details || {};
    const company = details.company || "Company";
    const position = details.position || "Position";

    switch (act.action) {
      case "created":
        return (
          <span className={styles.activityText}>
            Added <strong>{company}</strong> as <strong>{position}</strong>
          </span>
        );
      case "status_changed":
        return (
          <span className={styles.activityText}>
            Moved <strong>{company}</strong> to <strong>{details.to}</strong>
          </span>
        );
      case "interview_scheduled":
        return (
          <span className={styles.activityText}>
            Scheduled interview with <strong>{company}</strong>
          </span>
        );
      default:
        return <span className={styles.activityText}>Updated application status</span>;
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Application Pipeline</h1>
          <p className={styles.subtitle}>
            Drag and drop applications to update their status as your hiring process advances.
          </p>
        </div>
        <Button icon={<Plus size={18} />} onClick={() => handleAddClick("wishlist")}>
          Add Application
        </Button>
      </header>

      {error ? (
        <div style={{ display: "flex", gap: "12px", background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)", color: "var(--status-rejected)", padding: "16px", borderRadius: "var(--radius-lg)", alignItems: "center" }}>
          <AlertCircle size={20} />
          <p style={{ fontSize: "0.9rem", margin: 0 }}>Error loading applications: {error}</p>
        </div>
      ) : loading ? (
        <div style={{ display: "flex", flexGrow: 1, alignItems: "center", justifyContent: "center", minHeight: "350px" }}>
          <Loader size="md" />
        </div>
      ) : (
        <div className={styles.dashboardLayout}>
          {/* Main Pipeline Area */}
          <section className={styles.mainSection}>
            <KanbanBoard
              applications={applications}
              onCardClick={handleCardClick}
              onAddClick={handleAddClick}
              onDragComplete={fetchActivities}
              setApplications={setApplications}
            />
          </section>

          {/* Activity Feed Sidebar */}
          <aside className={styles.sidebarSection}>
            <h3 className={styles.sidebarTitle}>Recent Activity</h3>
            {activities.length > 0 ? (
              <div className={styles.activityFeed}>
                {activities.map((act) => (
                  <div key={act.id} className={styles.activityItem}>
                    {renderActivityIcon(act.action)}
                    <div className={styles.activityContent}>
                      {renderActivityText(act)}
                      <span className={styles.activityTime}>{timeAgo(act.created_at)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.emptyFeed}>
                {loadingActivities ? <Loader size="xs" /> : <p>No recent activity recorded.</p>}
              </div>
            )}
          </aside>
        </div>
      )}

      {/* Form Modal (shared for Add & Edit) */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={selectedApplication ? "Edit Application" : "Add Job Application"}
      >
        <ApplicationForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          application={selectedApplication}
          onSuccess={handleMutationSuccess}
          defaultStatus={defaultStatus}
        />
      </Modal>
    </div>
  );
}
