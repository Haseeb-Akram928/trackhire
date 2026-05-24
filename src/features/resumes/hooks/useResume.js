"use client";

import { useState, useCallback, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "react-hot-toast";

export function useResume() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resumeDetails, setResumeDetails] = useState(null);

  const supabase = useMemo(() => createClient(), []);

  // Fetch current resume database metadata
  const fetchResumeDetails = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error: fetchError } = await supabase
        .from("profiles")
        .select("resume_url, resume_text, full_name, email")
        .eq("id", user.id)
        .single();

      if (fetchError) throw fetchError;
      setResumeDetails(data || null);
      return data;
    } catch (err) {
      console.error("Failed to load resume settings details:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  // Upload PDF resume
  const uploadResume = useCallback(async (file) => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/resumes/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to upload resume file");
      }

      toast.success("Resume uploaded and parsed successfully!");
      await fetchResumeDetails();
      return data;
    } catch (err) {
      console.error("Error in uploadResume hook:", err);
      setError(err.message);
      toast.error(err.message || "Failed to upload resume");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchResumeDetails]);

  // Generate a temporary signed download URL for private resume PDF
  const getDownloadUrl = useCallback(async (resumeUrl) => {
    if (!resumeUrl) return null;
    try {
      const { data, error: signedUrlError } = await supabase.storage
        .from("resumes")
        .createSignedUrl(resumeUrl, 60); // 60 seconds expiry

      if (signedUrlError) throw signedUrlError;
      return data.signedUrl;
    } catch (err) {
      console.error("Failed to generate download URL:", err);
      toast.error("Could not retrieve download link");
      return null;
    }
  }, [supabase]);

  // Delete resume from profile and storage
  const deleteResume = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      if (!resumeDetails?.resume_url) return;

      // 1. Delete from storage bucket
      const { error: storageError } = await supabase.storage
        .from("resumes")
        .remove([resumeDetails.resume_url]);

      if (storageError) console.warn("Storage deletion warning:", storageError.message);

      // 2. Remove columns from database profile
      const { error: dbError } = await supabase
        .from("profiles")
        .update({
          resume_url: null,
          resume_text: null,
        })
        .eq("id", user.id);

      if (dbError) throw dbError;

      toast.success("Resume removed successfully");
      setResumeDetails((prev) => prev ? { ...prev, resume_url: null, resume_text: null } : null);
    } catch (err) {
      console.error("Error deleting resume:", err);
      setError(err.message);
      toast.error(err.message || "Failed to delete resume");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [supabase, resumeDetails]);

  return {
    loading,
    error,
    resumeDetails,
    uploadResume,
    fetchResumeDetails,
    getDownloadUrl,
    deleteResume,
  };
}
