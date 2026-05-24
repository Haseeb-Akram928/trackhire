"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, FileText, CheckCircle2, AlertCircle, AlertTriangle, Plus, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/Button/Button";
import { Input } from "@/components/ui/Input/Input";
import { Modal } from "@/components/ui/Modal/Modal";
import { ApplicationForm } from "@/features/applications/ApplicationForm/ApplicationForm";
import { useParseJob } from "../hooks/useParseJob";
import { useResume } from "@/features/resumes/hooks/useResume";
import { formatSalaryRange } from "@/utils/helpers";
import { useRouter } from "next/navigation";
import styles from "./JobParser.module.css";

export function JobParser() {
  const router = useRouter();
  const { loading, error: parseError, parsedData, parseJob, reset } = useParseJob();
  const { resumeDetails, fetchResumeDetails } = useResume();

  const [jobDescription, setJobDescription] = useState("");
  const [compareResume, setCompareResume] = useState(false);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);

  // Fetch resume details to verify if one is cached
  useEffect(() => {
    fetchResumeDetails();
  }, [fetchResumeDetails]);

  const hasResume = !!resumeDetails?.resume_url;

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!jobDescription.trim()) return;

    try {
      await parseJob(jobDescription.trim(), compareResume && hasResume);
    } catch (err) {
      // Handled in hook
    }
  };

  const handleAddSuccess = () => {
    setIsAddFormOpen(false);
    router.push("/dashboard"); // Redirect to pipeline upon success
  };

  // Pre-fill application details using parsed results
  const prefilledApplication = parsedData
    ? {
        company: parsedData.company || "",
        position: parsedData.position || "",
        status: "wishlist",
        location: parsedData.location || "",
        job_type: parsedData.job_type || "full-time",
        salary_min: parsedData.salary_min || null,
        salary_max: parsedData.salary_max || null,
        notes: `Extracted via TrackHire AI Parser\n\n=== ROLE SUMMARY ===\n${
          parsedData.summary || ""
        }\n\n=== KEY REQUIREMENTS ===\n${
          parsedData.key_requirements ? parsedData.key_requirements.join("\n- ") : ""
        }`,
      }
    : null;

  return (
    <div className={styles.container}>
      {/* Search workspace */}
      <div className={styles.inputCard}>
        <form onSubmit={handleAnalyze} className={styles.form}>
          <Input
            label="Job Description"
            type="textarea"
            placeholder="Paste the full job posting description here (requirements, salary details, location, responsibilities)..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            disabled={loading}
            style={{ minHeight: "220px" }}
          />

          <div className={styles.controlsRow}>
            <div className={styles.checkboxWrapper}>
              <input
                type="checkbox"
                id="compareResumeCheckbox"
                checked={compareResume}
                onChange={(e) => setCompareResume(e.target.checked)}
                className={styles.checkbox}
                disabled={loading}
              />
              <label htmlFor="compareResumeCheckbox" className={styles.checkboxLabel}>
                Compare qualifications against my primary resume
              </label>
            </div>

            {compareResume && !hasResume && (
              <div className={styles.warningBox}>
                <AlertTriangle size={14} />
                <span>No resume uploaded. Go to Settings to upload one first.</span>
              </div>
            )}
          </div>

          <div className={styles.actionButtons}>
            <Button
              type="submit"
              isLoading={loading}
              disabled={!jobDescription.trim()}
              icon={<Sparkles size={18} />}
              style={{ padding: "0 28px" }}
            >
              Analyze & Match with AI
            </Button>
            {parsedData && (
              <Button variant="ghost" onClick={reset} disabled={loading}>
                Clear
              </Button>
            )}
          </div>
        </form>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className={styles.skeletonContainer}>
          <div className={styles.skeletonLeft}>
            <div className={styles.shimmerLine} style={{ width: "30%", height: "24px" }} />
            <div className={styles.shimmerLine} style={{ width: "60%", height: "16px" }} />
            <div className={styles.shimmerLine} style={{ width: "100%", height: "80px" }} />
            <div className={styles.shimmerLine} style={{ width: "80%", height: "120px" }} />
          </div>
          <div className={styles.skeletonRight}>
            <div className={styles.shimmerCircle} />
            <div className={styles.shimmerLine} style={{ width: "70%", height: "16px" }} />
            <div className={styles.shimmerLine} style={{ width: "90%", height: "16px" }} />
          </div>
        </div>
      )}

      {/* Analysis Results Display */}
      {parsedData && !loading && (
        <div className={styles.resultsGrid}>
          {/* Role Details Card */}
          <div className={styles.resultsCard}>
            <div className={styles.cardHeader}>
              <Briefcase size={20} className={styles.headerIcon} />
              <h2 className={styles.cardTitle}>Extracted Position Details</h2>
            </div>

            <div className={styles.detailRows}>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Company</span>
                <span className={styles.detailValue}>{parsedData.company || "Not specified"}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Position</span>
                <span className={styles.detailValue}>{parsedData.position || "Not specified"}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Location</span>
                <span className={styles.detailValue}>{parsedData.location || "Not specified"}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Job Type</span>
                <span className={styles.detailValue} style={{ textTransform: "capitalize" }}>
                  {parsedData.job_type ? parsedData.job_type.replace("-", " ") : "Not specified"}
                </span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Salary Range</span>
                <span className={styles.detailValue}>
                  {formatSalaryRange(parsedData.salary_min, parsedData.salary_max, parsedData.location)}
                </span>
              </div>
            </div>

            <div className={styles.sectionDivider} />

            <div className={styles.textSection}>
              <h3 className={styles.sectionHeading}>Role Summary</h3>
              <p className={styles.sectionText}>{parsedData.summary || "No summary generated."}</p>
            </div>

            <div className={styles.textSection}>
              <h3 className={styles.sectionHeading}>Key Requirements</h3>
              {parsedData.key_requirements && parsedData.key_requirements.length > 0 ? (
                <ul className={styles.requirementsList}>
                  {parsedData.key_requirements.map((req, i) => (
                    <li key={i}>{req}</li>
                  ))}
                </ul>
              ) : (
                <p className={styles.sectionText}>No key requirements specified.</p>
              )}
            </div>

            <div className={styles.cardActions}>
              <Button icon={<Plus size={16} />} onClick={() => setIsAddFormOpen(true)}>
                Add to My Applications
              </Button>
            </div>
          </div>

          {/* Match Score Card */}
          {compareResume && hasResume && parsedData.match_score !== undefined && (
            <div className={styles.resultsCard}>
              <div className={styles.cardHeader}>
                <Sparkles size={20} className={styles.headerIcon} style={{ color: "var(--accent)" }} />
                <h2 className={styles.cardTitle}>Resume Match Analysis</h2>
              </div>

              {/* Circle Gauge Chart */}
              <div className={styles.gaugeContainer}>
                <svg width="120" height="120" viewBox="0 0 120 120" className={styles.gaugeSvg}>
                  <circle cx="60" cy="60" r="50" className={styles.gaugeBg} strokeWidth="8" fill="none" />
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    className={styles.gaugeFill}
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={2 * Math.PI * 50}
                    strokeDashoffset={2 * Math.PI * 50 * (1 - parsedData.match_score / 100)}
                    strokeLinecap="round"
                    transform="rotate(-90 60 60)"
                  />
                  <text x="60" y="60" textAnchor="middle" dominantBaseline="central" className={styles.gaugeText}>
                    {parsedData.match_score}%
                  </text>
                </svg>
                <div className={styles.gaugeMeta}>
                  <span className={styles.gaugeTitle}>Resume Match Score</span>
                  <span className={styles.gaugeSubtitle}>
                    {parsedData.match_score >= 80
                      ? "Excellent match! Go apply."
                      : parsedData.match_score >= 50
                      ? "Good match, refine details."
                      : "Gaps identified, tailor resume."}
                  </span>
                </div>
              </div>

              <div className={styles.sectionDivider} />

              {/* Gaps / Skills List */}
              <div className={styles.skillsSection}>
                <h3 className={styles.sectionHeading}>Matching Qualifications</h3>
                {parsedData.matching_skills && parsedData.matching_skills.length > 0 ? (
                  <div className={styles.skillsGrid}>
                    {parsedData.matching_skills.map((skill, i) => (
                      <span key={i} className={styles.skillBadgeMatch}>
                        <CheckCircle2 size={12} /> {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className={styles.sectionText}>No matching skills identified.</p>
                )}
              </div>

              <div className={styles.skillsSection}>
                <h3 className={styles.sectionHeading}>Missing Skills</h3>
                {parsedData.missing_skills && parsedData.missing_skills.length > 0 ? (
                  <div className={styles.skillsGrid}>
                    {parsedData.missing_skills.map((skill, i) => (
                      <span key={i} className={styles.skillBadgeGap}>
                        <AlertCircle size={12} /> {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className={styles.sectionText} style={{ color: "var(--status-offer)" }}>
                    No critical missing skills found!
                  </p>
                )}
              </div>

              <div className={styles.sectionDivider} />

              <div className={styles.textSection}>
                <h3 className={styles.sectionHeading}>Resume Tailoring Suggestions</h3>
                {parsedData.resume_suggestions && parsedData.resume_suggestions.length > 0 ? (
                  <ul className={styles.suggestionsList}>
                    {parsedData.resume_suggestions.map((sug, i) => (
                      <li key={i}>{sug}</li>
                    ))}
                  </ul>
                ) : (
                  <p className={styles.sectionText}>No specific resume enhancements recommended.</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add Application modal prefilled */}
      <Modal
        isOpen={isAddFormOpen}
        onClose={() => setIsAddFormOpen(false)}
        title="Add AI-Parsed Job Application"
      >
        <ApplicationForm
          isOpen={isAddFormOpen}
          onClose={() => setIsAddFormOpen(false)}
          application={prefilledApplication}
          onSuccess={handleAddSuccess}
        />
      </Modal>
    </div>
  );
}
