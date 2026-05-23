import React from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Sparkles, LayoutDashboard, BarChart3, ArrowRight, ShieldCheck, FileText } from "lucide-react";
import styles from "./page.module.css";

export const metadata = {
  title: "TrackHire | AI-Powered Job Search Pipeline & Tracker",
  description: "Visualize your job hunt with Kanban, parse resumes, and match against job descriptions using Google Gemini.",
};

export default async function LandingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className={styles.container}>
      {/* Navbar */}
      <nav className={styles.nav}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>T</span>
          <span className={styles.logoText}>TrackHire</span>
        </div>
        <div className={styles.navActions}>
          {user ? (
            <Link href="/dashboard" className={styles.btnPrimary}>
              Dashboard <ArrowRight size={16} />
            </Link>
          ) : (
            <>
              <Link href="/login" className={styles.btnGhost}>
                Sign In
              </Link>
              <Link href="/signup" className={styles.btnPrimary}>
                Get Started Free
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <header className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.badge}>
            <Sparkles size={14} className={styles.badgeIcon} />
            Powered by Google Gemini 2.0
          </div>
          <h1 className={styles.heroTitle}>
            Organize Your Job Hunt. <br />
            <span className="gradient-accent-text">Accelerated by AI.</span>
          </h1>
          <p className={styles.heroSubtitle}>
            A full-stack, secure job application pipeline built for modern job seekers. Track applications, upload resumes for automated parsing, and leverage AI to match your qualifications against job postings.
          </p>
          <div className={styles.heroCtas}>
            {user ? (
              <Link href="/dashboard" className={styles.btnLarge}>
                Go to Dashboard <ArrowRight size={20} />
              </Link>
            ) : (
              <>
                <Link href="/signup" className={styles.btnLarge}>
                  Start Tracking Free <ArrowRight size={20} />
                </Link>
                <Link href="/login" className={styles.btnLargeOutline}>
                  Sign In to Account
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Dashboard Preview Teaser Graphic */}
        <div className={styles.heroImageWrapper}>
          <div className={styles.dashboardPreview}>
            <div className={styles.previewHeader}>
              <div className={styles.previewDots}>
                <span className={styles.dot} />
                <span className={styles.dot} />
                <span className={styles.dot} />
              </div>
              <div className={styles.previewTitle}>TrackHire Dashboard</div>
            </div>
            <div className={styles.previewBody}>
              <div className={styles.previewColumn}>
                <div className={styles.previewColHeader}>Wishlist (3)</div>
                <div className={styles.previewCard}>Google • Product Designer</div>
                <div className={styles.previewCard}>Stripe • Frontend Architect</div>
              </div>
              <div className={styles.previewColumn}>
                <div className={styles.previewColHeader}>Applied (5)</div>
                <div className={styles.previewCard}>Vercel • NextJS Engineer</div>
                <div className={styles.previewCard}>Linear • Staff Developer</div>
              </div>
              <div className={styles.previewColumn}>
                <div className={styles.previewColHeader}>Interview (2)</div>
                <div className={`${styles.previewCard} ${styles.previewCardHighlight}`}>
                  Airbnb • UI Engineer
                  <span className={styles.previewCardBadge}>High Priority</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Grid */}
      <section className={styles.features}>
        <h2 className={styles.featuresTitle}>Built to solve your job application fatigue</h2>
        <p className={styles.featuresSubtitle}>
          Everything you need in one unified experience. Secure, fast, and optimized.
        </p>

        <div className={styles.grid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <LayoutDashboard size={24} />
            </div>
            <h3 className={styles.featureName}>Kanban Pipeline</h3>
            <p className={styles.featureText}>
              Drag and drop applications across custom statuses (Wishlist, Applied, Interview, Offer, Rejected, Ghosted) with optimistic UI updates.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <Sparkles size={24} />
            </div>
            <h3 className={styles.featureName}>AI Job Analyzer</h3>
            <p className={styles.featureText}>
              Paste any job description and let Gemini extract salary limits, core skills, key requirements, and automatically calculate a match score.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <FileText size={24} />
            </div>
            <h3 className={styles.featureName}>Resume Parser</h3>
            <p className={styles.featureText}>
              Upload your PDF resume to a private storage bucket. Raw text is extracted server-side and automatically matched against new job requirements.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <BarChart3 size={24} />
            </div>
            <h3 className={styles.featureName}>Detailed Analytics</h3>
            <p className={styles.featureText}>
              Visualize your pipeline with pie charts of status counts, timeline graphs of application volume, and response rate analytics.
            </p>
          </div>
        </div>
      </section>

      {/* Security Banner */}
      <section className={styles.security}>
        <div className={styles.securityCard}>
          <ShieldCheck size={40} className={styles.securityIcon} />
          <div>
            <h3 className={styles.securityTitle}>Secure by Design</h3>
            <p className={styles.securityText}>
              All data tables use Supabase Row Level Security (RLS) to enforce strict user partitioning. Your uploaded resumes are stored in a private bucket accessible only to you.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>&copy; {new Date().getFullYear()} TrackHire. Made for developers by developers.</p>
      </footer>
    </div>
  );
}
