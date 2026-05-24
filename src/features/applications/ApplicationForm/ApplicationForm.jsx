"use client";

import React, { useState, useEffect } from "react";
import { STATUSES, PRIORITIES, JOB_TYPES } from "@/utils/constants";
import { Button } from "@/components/ui/Button/Button";
import { Input } from "@/components/ui/Input/Input";
import { useApplicationMutations } from "../hooks/useApplicationMutations";
import styles from "./ApplicationForm.module.css";

export function ApplicationForm({ isOpen, onClose, application = null, onSuccess, defaultStatus = "wishlist" }) {
  const isEdit = !!application && !!application.id;
  const { createApplication, updateApplication, deleteApplication, loading } = useApplicationMutations();

  // Form fields state
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [status, setStatus] = useState("wishlist");
  const [priority, setPriority] = useState("medium");
  const [jobType, setJobType] = useState("full-time");
  const [location, setLocation] = useState("");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [appliedAt, setAppliedAt] = useState("");
  const [interviewAt, setInterviewAt] = useState("");
  const [followedUp, setFollowedUp] = useState(false);
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [notes, setNotes] = useState("");

  const [validationErrors, setValidationErrors] = useState({});

  // Reset/populate fields when modal opens or application changes
  useEffect(() => {
    if (isOpen) {
      if (application) {
        setCompany(application.company || "");
        setPosition(application.position || "");
        setStatus(application.status || "wishlist");
        setPriority(application.priority || "medium");
        setJobType(application.job_type || "full-time");
        setLocation(application.location || "");
        setSalaryMin(application.salary_min !== null ? String(application.salary_min) : "");
        setSalaryMax(application.salary_max !== null ? String(application.salary_max) : "");
        setJobUrl(application.job_url || "");
        setAppliedAt(application.applied_at || "");
        setInterviewAt(application.interview_at ? application.interview_at.slice(0, 16) : "");
        setFollowedUp(!!application.followed_up);
        setContactName(application.contact_name || "");
        setContactEmail(application.contact_email || "");
        setNotes(application.notes || "");
      } else {
        // Defaults for new application
        setCompany("");
        setPosition("");
        setStatus(defaultStatus);
        setPriority("medium");
        setJobType("full-time");
        setLocation("");
        setSalaryMin("");
        setSalaryMax("");
        setJobUrl("");
        setAppliedAt(new Date().toISOString().split("T")[0]); // Default to today
        setInterviewAt("");
        setFollowedUp(false);
        setContactName("");
        setContactEmail("");
        setNotes("");
      }
      setValidationErrors({});
    }
  }, [isOpen, application, defaultStatus]);

  function validate() {
    const errors = {};
    if (!company.trim()) errors.company = "Company name is required";
    if (!position.trim()) errors.position = "Position title is required";

    if (salaryMin && isNaN(Number(salaryMin))) errors.salaryMin = "Must be a valid number";
    if (salaryMax && isNaN(Number(salaryMax))) errors.salaryMax = "Must be a valid number";

    if (salaryMin && salaryMax && Number(salaryMin) > Number(salaryMax)) {
      errors.salaryMax = "Max salary must be greater than or equal to min salary";
    }

    if (contactEmail && !/\S+@\S+\.\S+/.test(contactEmail)) {
      errors.contactEmail = "Invalid email format";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    const data = {
      company: company.trim(),
      position: position.trim(),
      status,
      priority,
      job_type: jobType,
      location: location.trim() || null,
      salary_min: salaryMin ? Number(salaryMin) : null,
      salary_max: salaryMax ? Number(salaryMax) : null,
      job_url: jobUrl.trim() || null,
      applied_at: appliedAt || null,
      interview_at: interviewAt ? new Date(interviewAt).toISOString() : null,
      followed_up: followedUp,
      contact_name: contactName.trim() || null,
      contact_email: contactEmail.trim() || null,
      notes: notes.trim() || null,
    };

    try {
      if (isEdit) {
        await updateApplication(application.id, data);
      } else {
        await createApplication(data);
      }
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      // toast is triggered inside hook mutations
    }
  }

  async function handleDelete() {
    if (!application) return;
    if (window.confirm(`Are you sure you want to delete your application for ${company}?`)) {
      try {
        await deleteApplication(application.id);
        if (onSuccess) onSuccess();
        onClose();
      } catch (err) {
        // Handled inside hook
      }
    }
  }

  // Visibility is handled by the parent Modal component — no need to gate here (#13)

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGrid}>
        {/* Core fields */}
        <Input
          label="Company Name *"
          placeholder="e.g. Google"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          error={validationErrors.company}
          disabled={loading}
        />

        <Input
          label="Position / Role Title *"
          placeholder="e.g. Senior Frontend Engineer"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          error={validationErrors.position}
          disabled={loading}
        />

        {/* Dropdowns */}
        <div className={styles.inputContainer}>
          <label className={styles.selectLabel}>Pipeline Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className={styles.select}
            disabled={loading}
          >
            {STATUSES.map((st) => (
              <option key={st.id} value={st.id}>
                {st.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.inputContainer}>
          <label className={styles.selectLabel}>Priority Level</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className={styles.select}
            disabled={loading}
          >
            {PRIORITIES.map((pr) => (
              <option key={pr.id} value={pr.id}>
                {pr.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.inputContainer}>
          <label className={styles.selectLabel}>Job Type</label>
          <select
            value={jobType}
            onChange={(e) => setJobType(e.target.value)}
            className={styles.select}
            disabled={loading}
          >
            {JOB_TYPES.map((jt) => (
              <option key={jt.id} value={jt.id}>
                {jt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Details fields */}
        <Input
          label="Job URL"
          placeholder="e.g. https://google.com/careers/role"
          value={jobUrl}
          onChange={(e) => setJobUrl(e.target.value)}
          disabled={loading}
        />

        <Input
          label="Location"
          placeholder="e.g. Remote / New York, NY"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          disabled={loading}
        />

        <div className={styles.salaryGroup}>
          <Input
            label="Min Salary ($)"
            placeholder="e.g. 80000"
            value={salaryMin}
            onChange={(e) => setSalaryMin(e.target.value)}
            error={validationErrors.salaryMin}
            disabled={loading}
          />
          <Input
            label="Max Salary ($)"
            placeholder="e.g. 120000"
            value={salaryMax}
            onChange={(e) => setSalaryMax(e.target.value)}
            error={validationErrors.salaryMax}
            disabled={loading}
          />
        </div>

        {/* Date fields */}
        <Input
          label="Date Applied"
          type="date"
          value={appliedAt}
          onChange={(e) => setAppliedAt(e.target.value)}
          disabled={loading}
        />

        <Input
          label="Interview Schedule"
          type="datetime-local"
          value={interviewAt}
          onChange={(e) => setInterviewAt(e.target.value)}
          disabled={loading}
        />

        {/* Contact fields */}
        <Input
          label="Contact Person Name"
          placeholder="e.g. Jane Doe (Recruiter)"
          value={contactName}
          onChange={(e) => setContactName(e.target.value)}
          disabled={loading}
        />

        <Input
          label="Contact Person Email"
          placeholder="e.g. recruiter@company.com"
          value={contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
          error={validationErrors.contactEmail}
          disabled={loading}
        />
      </div>

      {/* Notes and check */}
      <div className={styles.checkboxContainer}>
        <input
          type="checkbox"
          id="followedUp"
          checked={followedUp}
          onChange={(e) => setFollowedUp(e.target.checked)}
          className={styles.checkbox}
          disabled={loading}
        />
        <label htmlFor="followedUp" className={styles.checkboxLabel}>
          I have followed up on this application
        </label>
      </div>

      <Input
        label="Personal Notes"
        type="textarea"
        placeholder="Add details, next steps, research, or questions for this job application..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        disabled={loading}
        style={{ minHeight: "100px" }}
      />

      {/* Footer controls */}
      <div className={styles.footer}>
        {isEdit && (
          <Button
            type="button"
            variant="danger"
            onClick={handleDelete}
            disabled={loading}
            style={{ marginRight: "auto" }}
          >
            Delete
          </Button>
        )}
        <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" isLoading={loading}>
          {isEdit ? "Save Changes" : "Create Application"}
        </Button>
      </div>
    </form>
  );
}
