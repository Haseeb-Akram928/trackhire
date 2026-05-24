"use client";

import React, { useState, useEffect, useRef } from "react";
import { FileUp, FileText, Trash2, Download, AlertCircle, FileCheck } from "lucide-react";
import { Loader } from "@/components/ui/Loader/Loader";
import { Button } from "@/components/ui/Button/Button";
import { useResume } from "../hooks/useResume";
import { toast } from "react-hot-toast";
import styles from "./ResumeUpload.module.css";

export function ResumeUpload() {
  const {
    loading,
    error,
    resumeDetails,
    uploadResume,
    fetchResumeDetails,
    getDownloadUrl,
    deleteResume,
  } = useResume();

  const [dragActive, setDragActive] = useState(false);
  const [downloadLink, setDownloadLink] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchResumeDetails();
  }, [fetchResumeDetails]);

  // Generate signed download link when resume details are fetched
  useEffect(() => {
    async function updateLink() {
      if (resumeDetails?.resume_url) {
        const link = await getDownloadUrl(resumeDetails.resume_url);
        setDownloadLink(link);
      } else {
        setDownloadLink(null);
      }
    }
    updateLink();
  }, [resumeDetails, getDownloadUrl]);

  // Handle file drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = async (file) => {
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast.error("Only PDF documents are supported.");
      return;
    }
    try {
      await uploadResume(file);
    } catch (err) {
      // toast shown in hook
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current.click();
  };

  const isUploaded = !!resumeDetails?.resume_url;

  return (
    <div className={styles.container}>
      {error && (
        <div className={styles.errorBanner}>
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className={styles.loadingState}>
          <Loader size="md" />
          <p className={styles.loadingText}>Processing and extracting text from PDF resume...</p>
        </div>
      ) : isUploaded ? (
        /* Uploaded details state */
        <div className={styles.uploadedCard}>
          <div className={styles.fileIconWrapper}>
            <FileCheck size={28} className={styles.successIcon} />
          </div>
          <div className={styles.fileDetails}>
            <span className={styles.fileName}>resume.pdf</span>
            <span className={styles.fileStatus}>Active & Parsed for AI evaluation</span>
          </div>

          <div className={styles.actions}>
            {downloadLink && (
              <a
                href={downloadLink}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.downloadLink}
                title="Download resume PDF"
              >
                <Button variant="ghost" size="sm" icon={<Download size={14} />}>
                  Download
                </Button>
              </a>
            )}
            <Button
              variant="danger"
              size="sm"
              icon={<Trash2 size={14} />}
              onClick={deleteResume}
              title="Remove resume"
            >
              Delete
            </Button>
          </div>
        </div>
      ) : (
        /* Upload area state */
        <div
          className={`${styles.uploadZone} ${dragActive ? styles.dragActive : ""}`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={onButtonClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            className={styles.hiddenInput}
            accept=".pdf"
            onChange={handleChange}
          />
          <div className={styles.uploadIconWrapper}>
            <FileUp size={30} className={styles.uploadIcon} />
          </div>
          <div className={styles.uploadTextContainer}>
            <p className={styles.primaryText}>
              Drag and drop your resume here, or <span className={styles.browseLink}>browse files</span>
            </p>
            <p className={styles.secondaryText}>Supports PDF files up to 5MB</p>
          </div>
        </div>
      )}
    </div>
  );
}
