"use client";

import React, { useState, useEffect, useMemo } from "react";
import { User, FileText, Shield, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button/Button";
import { Input } from "@/components/ui/Input/Input";
import { ResumeUpload } from "../resumes/ResumeUpload/ResumeUpload";
import { toast } from "react-hot-toast";
import styles from "./Settings.module.css";

export function ProfileSettings() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [initialFullName, setInitialFullName] = useState("");
  const [aiProvider, setAiProvider] = useState("Google Gemini 2.0 Flash");

  const supabase = useMemo(() => createClient(), []);

  // Fetch current user settings details
  useEffect(() => {
    async function loadUserData() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        setEmail(user.email || "");

        // Fetch profiles table detail
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", user.id)
          .single();

        if (error) throw error;

        const name = profile?.full_name || user.user_metadata?.full_name || "";
        setFullName(name);
        setInitialFullName(name);
      } catch (err) {
        console.error("Failed to load user profile settings:", err);
      }
    }
    loadUserData();
  }, [supabase]);

  // Fetch active AI provider status
  useEffect(() => {
    async function getStatus() {
      try {
        const res = await fetch("/api/ai/status");
        if (res.ok) {
          const json = await res.json();
          if (json.provider) {
            setAiProvider(json.provider);
          }
        }
      } catch (err) {
        console.error("Failed to load AI status:", err);
      }
    }
    getStatus();
  }, []);

  // Handle Display Name form submit
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!fullName.trim()) {
      toast.error("Full Name cannot be empty");
      return;
    }
    if (fullName.trim() === initialFullName.trim()) return;

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // 1. Update profiles table
      const { error: dbError } = await supabase
        .from("profiles")
        .update({
          full_name: fullName.trim(),
        })
        .eq("id", user.id);

      if (dbError) throw dbError;

      // 2. Update auth metadata
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          full_name: fullName.trim(),
        },
      });

      if (authError) throw authError;

      setInitialFullName(fullName.trim());
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error("Failed to update profile settings:", err);
      toast.error(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const isNameChanged = fullName.trim() !== initialFullName.trim();

  return (
    <div className={styles.container}>
      {/* Profile Details section */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <User size={20} className={styles.headerIcon} />
          <h2 className={styles.cardTitle}>Profile Details</h2>
        </div>

        <form onSubmit={handleUpdateProfile} className={styles.form}>
          <Input
            label="Full Name"
            placeholder="e.g. Jane Doe"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            disabled={loading}
          />

          <Input
            label="Email Address"
            type="email"
            value={email}
            disabled={true}
            description="Your login email cannot be changed"
          />

          <Button
            type="submit"
            isLoading={loading}
            disabled={!isNameChanged || loading}
            style={{ alignSelf: "flex-start" }}
          >
            Save Profile Changes
          </Button>
        </form>
      </div>

      {/* Resume Management section */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <FileText size={20} className={styles.headerIcon} />
          <h2 className={styles.cardTitle}>Default Resume</h2>
        </div>
        <p className={styles.cardDescription}>
          Upload your PDF resume. Our AI parser will extract text contents and cache them to calculate job match scores inside the parser tab.
        </p>

        <ResumeUpload />
      </div>

      {/* Security credentials settings page placeholder */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <Shield size={20} className={styles.headerIcon} />
          <h2 className={styles.cardTitle}>System & Integration</h2>
        </div>
        <p className={styles.cardDescription}>
          Active session credentials and details about AI parser integration:
        </p>
        <div className={styles.infoBox}>
          <Sparkles size={16} className={styles.infoIcon} />
          <span>{aiProvider} matching integration is active and running.</span>
        </div>
      </div>
    </div>
  );
}
