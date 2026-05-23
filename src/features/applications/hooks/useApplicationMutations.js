"use client";

import { useState, useMemo, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { POSITION_GAP } from "@/utils/constants";
import { toast } from "react-hot-toast";

export function useApplicationMutations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const supabase = useMemo(() => createClient(), []);

  // Cache the authenticated user to avoid redundant getUser() calls per action (#17)
  const userRef = useRef(null);

  async function getAuthUser() {
    if (userRef.current) return userRef.current;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");
    userRef.current = user;
    return user;
  }

  // Helper to log actions in the activity_log table
  async function logActivity(userId, applicationId, action, details = {}) {
    const { error: logError } = await supabase
      .from("activity_log")
      .insert({
        user_id: userId,
        application_id: applicationId,
        action,
        details,
      });

    if (logError) {
      console.error("Failed to write activity log:", logError);
    }
  }

  // Create new application
  async function createApplication(appData) {
    setLoading(true);
    setError(null);
    try {
      const user = await getAuthUser();

      // 1. Determine position_index (max index in target column + GAP)
      const targetStatus = appData.status || "wishlist";
      const { data: maxIndexApp, error: maxIndexError } = await supabase
        .from("applications")
        .select("position_index")
        .eq("user_id", user.id)
        .eq("status", targetStatus)
        .order("position_index", { ascending: false })
        .limit(1);

      if (maxIndexError) throw maxIndexError;

      let nextIndex = POSITION_GAP;
      if (maxIndexApp && maxIndexApp.length > 0) {
        nextIndex = (maxIndexApp[0].position_index || 0) + POSITION_GAP;
      }

      // 2. Insert application
      const newApp = {
        ...appData,
        user_id: user.id,
        position_index: nextIndex,
      };

      const { data, error: insertError } = await supabase
        .from("applications")
        .insert(newApp)
        .select()
        .single();

      if (insertError) throw insertError;

      // 3. Log Activity
      await logActivity(user.id, data.id, "created", {
        company: data.company,
        position: data.position,
        status: data.status,
      });

      toast.success(`Added ${data.company} to pipeline`);
      return data;
    } catch (err) {
      console.error("Error creating application:", err);
      setError(err.message);
      toast.error(err.message || "Failed to add application");
      throw err;
    } finally {
      setLoading(false);
    }
  }

  // Update existing application
  async function updateApplication(id, updateData) {
    setLoading(true);
    setError(null);
    try {
      const user = await getAuthUser();

      // 1. Fetch current application to check for status transitions
      const { data: currentApp, error: fetchError } = await supabase
        .from("applications")
        .select("*")
        .eq("id", id)
        .single();

      if (fetchError) throw fetchError;

      // 2. Perform update
      const { data: updatedApp, error: updateError } = await supabase
        .from("applications")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (updateError) throw updateError;

      // 3. Log transitions/actions
      const logPromises = [];

      // Status change log + success toast (#8)
      if (updateData.status && updateData.status !== currentApp.status) {
        logPromises.push(
          logActivity(user.id, id, "status_changed", {
            company: updatedApp.company,
            position: updatedApp.position,
            from: currentApp.status,
            to: updatedApp.status,
          })
        );
        toast.success(`Moved ${updatedApp.company} to ${updatedApp.status}`);
      }

      // Interview scheduled log
      if (updateData.interview_at && updateData.interview_at !== currentApp.interview_at) {
        logPromises.push(
          logActivity(user.id, id, "interview_scheduled", {
            company: updatedApp.company,
            position: updatedApp.position,
            interview_at: updatedApp.interview_at,
          })
        );
      }

      await Promise.all(logPromises);
      return updatedApp;
    } catch (err) {
      console.error("Error updating application:", err);
      setError(err.message);
      toast.error(err.message || "Failed to update application");
      throw err;
    } finally {
      setLoading(false);
    }
  }

  // Delete application
  async function deleteApplication(id) {
    setLoading(true);
    setError(null);
    try {
      const user = await getAuthUser();

      // Get app info first to show in toast/logs
      const { data: currentApp } = await supabase
        .from("applications")
        .select("company, position")
        .eq("id", id)
        .single();

      // Log deletion BEFORE the delete, using null application_id to avoid
      // FK cascade deletion. The application details are stored in the JSONB
      // details column for audit trail purposes. (#3)
      // NOTE: The activity_log FK is ON DELETE CASCADE, so any log entries
      // referencing this application_id will also be removed. That's why we
      // use null here — to preserve at least the deletion record itself.
      await logActivity(user.id, null, "deleted", {
        company: currentApp?.company,
        position: currentApp?.position,
      });

      const { error: deleteError } = await supabase
        .from("applications")
        .delete()
        .eq("id", id);

      if (deleteError) throw deleteError;

      if (currentApp) {
        toast.success(`Removed ${currentApp.company} application`);
      } else {
        toast.success("Application removed successfully");
      }
    } catch (err) {
      console.error("Error deleting application:", err);
      setError(err.message);
      toast.error(err.message || "Failed to delete application");
      throw err;
    } finally {
      setLoading(false);
    }
  }

  // Batch update position indices for re-indexing a column (#2)
  async function batchUpdatePositions(updates) {
    try {
      const user = await getAuthUser();
      const promises = updates.map(({ id, position_index }) =>
        supabase
          .from("applications")
          .update({ position_index })
          .eq("id", id)
          .eq("user_id", user.id)
      );
      await Promise.all(promises);
    } catch (err) {
      console.error("Batch position update failed:", err);
      throw err;
    }
  }

  return {
    createApplication,
    updateApplication,
    deleteApplication,
    batchUpdatePositions,
    loading,
    error,
  };
}
