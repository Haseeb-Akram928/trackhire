"use client";

import React, { useState } from "react";
import { Plus, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button/Button";
import { Modal } from "@/components/ui/Modal/Modal";
import { ApplicationForm } from "@/features/applications/ApplicationForm/ApplicationForm";
import { ApplicationTable } from "@/features/applications/ApplicationTable/ApplicationTable";
import { useApplications } from "@/features/applications/hooks/useApplications";
import { Loader } from "@/components/ui/Loader/Loader";
import styles from "./ApplicationsPage.module.css";

export default function ApplicationsPage() {
  const { applications, loading, error, refetch } = useApplications();

  // Modal control states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);

  // Row click triggers edit modal
  const handleRowClick = (application) => {
    setSelectedApplication(application);
    setIsFormOpen(true);
  };

  // Add click triggers creation modal
  const handleAddClick = () => {
    setSelectedApplication(null);
    setIsFormOpen(true);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Applications List</h1>
          <p className={styles.subtitle}>
            Detailed tabular view of your job applications with custom sorting and filters.
          </p>
        </div>
        <Button icon={<Plus size={18} />} onClick={handleAddClick}>
          Add Application
        </Button>
      </header>

      {error ? (
        <div className={styles.errorBanner}>
          <AlertCircle size={20} />
          <p className={styles.errorText}>Error loading applications: {error}</p>
        </div>
      ) : loading ? (
        <div className={styles.loadingContainer}>
          <Loader size="md" />
        </div>
      ) : (
        <ApplicationTable
          applications={applications}
          onRowClick={handleRowClick}
        />
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
          onSuccess={refetch}
        />
      </Modal>
    </div>
  );
}
