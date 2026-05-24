import React from "react";
import { ProfileSettings } from "@/features/settings/ProfileSettings";
import styles from "./SettingsPage.module.css";

export const metadata = {
  title: "Profile & Settings | TrackHire",
  description: "Manage your user profile details, upload your PDF resume, and configure account parameters.",
};

export default function SettingsPage() {
  return (
    <div className={styles.container}>
      <header>
        <h1 className={styles.title}>Settings</h1>
        <p className={styles.subtitle}>
          Manage your personal details, credentials, and default resume settings.
        </p>
      </header>

      <ProfileSettings />
    </div>
  );
}
