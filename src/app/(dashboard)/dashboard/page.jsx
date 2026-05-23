import React from "react";
import { Plus, LayoutGrid, Calendar, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/Button/Button";
import { Badge } from "@/components/ui/Badge/Badge";
import styles from "./DashboardPage.module.css";

export const metadata = {
  title: "Dashboard Pipeline | TrackHire",
  description: "Manage your job applications pipeline, drag and drop cards, and keep track of your career progress.",
};

export default function DashboardPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>My Applications</h1>
          <p className={styles.subtitle}>Track, organize, and advance your job search pipeline.</p>
        </div>
        <Button icon={<Plus size={18} />}>
          Add Application
        </Button>
      </header>

      {/* Temp placeholder view showing columns skeleton */}
      <div className={styles.kanbanPlaceholder}>
        <div className={styles.columnTeaser}>
          <div className={styles.columnHeader}>
            <span className={styles.columnName}>Wishlist</span>
            <Badge type="status" value="wishlist">0</Badge>
          </div>
          <div className={styles.emptyCardSlot}>
            <p>Drag job offers here to start your journey</p>
          </div>
        </div>

        <div className={styles.columnTeaser}>
          <div className={styles.columnHeader}>
            <span className={styles.columnName}>Applied</span>
            <Badge type="status" value="applied">0</Badge>
          </div>
          <div className={styles.emptyCardSlot}>
            <p>Track jobs you've applied to</p>
          </div>
        </div>

        <div className={styles.columnTeaser}>
          <div className={styles.columnHeader}>
            <span className={styles.columnName}>Interview</span>
            <Badge type="status" value="interview">0</Badge>
          </div>
          <div className={styles.emptyCardSlot}>
            <p>Prepare for upcoming interviews</p>
          </div>
        </div>

        <div className={styles.columnTeaser}>
          <div className={styles.columnHeader}>
            <span className={styles.columnName}>Offer</span>
            <Badge type="status" value="offer">0</Badge>
          </div>
          <div className={styles.emptyCardSlot}>
            <p>Keep your wins here!</p>
          </div>
        </div>
      </div>

      <section className={styles.nextStepsSection}>
        <h2 className={styles.sectionTitle}>What's Next?</h2>
        <div className={styles.stepsGrid}>
          <div className={styles.stepCard}>
            <div className={styles.stepIconWrapper}>
              <LayoutGrid size={24} />
            </div>
            <h3 className={styles.stepTitle}>Set Up Your Database</h3>
            <p className={styles.stepDescription}>
              Run the SQL queries in <code>supabase/schema.sql</code> inside your Supabase project's SQL Editor to set up tables.
            </p>
          </div>

          <div className={styles.stepCard}>
            <div className={styles.stepIconWrapper}>
              <Calendar size={24} />
            </div>
            <h3 className={styles.stepTitle}>Configure Environment Variables</h3>
            <p className={styles.stepDescription}>
              Fill in your Supabase credentials and Gemini API key inside <code>.env.local</code>.
            </p>
          </div>

          <div className={styles.stepCard}>
            <div className={styles.stepIconWrapper}>
              <HelpCircle size={24} />
            </div>
            <h3 className={styles.stepTitle}>Day 2 Awaits</h3>
            <p className={styles.stepDescription}>
              Once Day 1 foundation is tested, we'll build out the interactive Kanban drag-and-drop board and database CRUD.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
