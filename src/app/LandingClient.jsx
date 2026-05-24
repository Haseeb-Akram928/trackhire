"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import {
  Sparkles,
  LayoutDashboard,
  BarChart3,
  ArrowRight,
  ShieldCheck,
  FileText,
  Zap,
  Target,
  Github,
  Linkedin,
  Twitter,
  ChevronRight,
  Brain,
  Upload,
  Layers,
  TrendingUp,
  MousePointerClick,
  Lock,
  Heart,
} from "lucide-react";
import styles from "./page.module.css";

/* ── Intersection Observer hook for scroll-triggered reveals ── */

function useReveal(options = {}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px", ...options }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, isVisible];
}

/* ── Animated Counter ── */

function AnimatedCounter({ target, suffix = "", duration = 2000 }) {
  const [count, setCount] = useState(0);
  const [counterRef, isVisible] = useReveal();

  useEffect(() => {
    if (!isVisible) return;
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isVisible, target, duration]);

  return (
    <span ref={counterRef} className={styles.statNumber}>
      {count.toLocaleString()}{suffix}
    </span>
  );
}

/* ── Main Landing Page Client Component ── */

export default function LandingClient({ isLoggedIn }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Reveal hooks for each section */
  const [statsRef, statsVisible] = useReveal();
  const [featuresRef, featuresVisible] = useReveal();
  const [howRef, howVisible] = useReveal();
  const [bentoRef, bentoVisible] = useReveal();
  const [ctaRef, ctaVisible] = useReveal();
  const [footerRef, footerVisible] = useReveal();

  const techStack = [
    { name: "Next.js 16", icon: "▲" },
    { name: "React 19", icon: "⚛" },
    { name: "Supabase", icon: "⚡" },
    { name: "Groq AI", icon: "🧠" },
    { name: "Recharts", icon: "📊" },
    { name: "DnD Kit", icon: "🖱" },
  ];

  return (
    <div className={styles.page}>
      {/* ━━━ Navbar ━━━ */}
      <nav className={`${styles.nav} ${scrolled ? styles.navScrolled : ""}`}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoIcon}>T</span>
          <span className={styles.logoText}>TrackHire</span>
        </Link>

        <div className={styles.navLinks}>
          <a href="#features" className={styles.navLink}>Features</a>
          <a href="#how-it-works" className={styles.navLink}>How It Works</a>
          <a href="#showcase" className={styles.navLink}>Showcase</a>
        </div>

        <div className={styles.navActions}>
          {isLoggedIn ? (
            <Link href="/dashboard" className={styles.btnPrimary}>
              Dashboard <ArrowRight size={16} />
            </Link>
          ) : (
            <>
              <Link href="/login" className={styles.btnGhost}>Sign In</Link>
              <Link href="/signup" className={styles.btnPrimary}>
                Get Started Free
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* ━━━ Hero Section ━━━ */}
      <header className={styles.hero}>
        <div className={styles.heroOrb1} />
        <div className={styles.heroOrb2} />
        <div className={styles.heroOrb3} />
        <div className={styles.heroGrid} />

        <div className={styles.heroContent}>
          <div className={styles.badge}>
            <Sparkles size={14} className={styles.badgeIcon} />
            AI-Powered Job Tracking
          </div>

          <h1 className={styles.heroTitle}>
            Your Job Hunt, <br />
            <span className={styles.heroTitleGradient}>Organized & Accelerated.</span>
          </h1>

          <p className={styles.heroSubtitle}>
            Stop losing track of applications. TrackHire gives you a stunning Kanban pipeline,
            AI-powered job matching, resume parsing, and real-time analytics — all in one place.
          </p>

          <div className={styles.heroCtas}>
            {isLoggedIn ? (
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

        {/* Dashboard Preview Mock */}
        <div className={styles.previewWrapper}>
          <div className={styles.previewGlow} />
          <div className={styles.dashboardPreview}>
            <div className={styles.previewHeader}>
              <div className={styles.previewDots}>
                <span className={styles.dot} />
                <span className={styles.dot} />
                <span className={styles.dot} />
              </div>
              <div className={styles.previewTitle}>TrackHire — Pipeline View</div>
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
              <div className={styles.previewColumn}>
                <div className={styles.previewColHeader}>Offer (1)</div>
                <div className={`${styles.previewCard} ${styles.previewCardHighlight}`}>
                  Figma • Design Systems
                  <span className={`${styles.previewCardBadge} ${styles.previewCardBadgeGreen}`}>🎉 Congrats</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ━━━ Tech Stack Marquee ━━━ */}
      <section className={styles.trustedSection}>
        <p className={styles.trustedLabel}>Built with modern, production-grade technologies</p>
        <div className={styles.marqueeTrack}>
          {[...techStack, ...techStack].map((tech, i) => (
            <div key={i} className={styles.marqueeItem}>
              <span className={styles.marqueeIcon}>{tech.icon}</span>
              {tech.name}
            </div>
          ))}
        </div>
      </section>

      {/* ━━━ Stats Counter Section ━━━ */}
      <section className={styles.statsSection} ref={statsRef}>
        <div className={`${styles.statsGrid} ${styles.staggerChildren} ${statsVisible ? styles.staggerVisible : ""}`}>
          <div className={styles.statCard}>
            <AnimatedCounter target={6} suffix="+" />
            <div className={styles.statLabel}>Pipeline Statuses</div>
          </div>
          <div className={styles.statCard}>
            <AnimatedCounter target={100} suffix="%" />
            <div className={styles.statLabel}>Secure with RLS</div>
          </div>
          <div className={styles.statCard}>
            <AnimatedCounter target={3} suffix="s" />
            <div className={styles.statLabel}>AI Parse Speed</div>
          </div>
          <div className={styles.statCard}>
            <AnimatedCounter target={5} suffix="" />
            <div className={styles.statLabel}>Powerful Dashboards</div>
          </div>
        </div>
      </section>

      {/* ━━━ Features Section ━━━ */}
      <section className={styles.features} id="features" ref={featuresRef}>
        <div className={`${styles.reveal} ${featuresVisible ? styles.revealVisible : ""}`}>
          <p className={styles.sectionEyebrow}>Features</p>
          <h2 className={styles.sectionTitle}>Everything you need to land your dream job</h2>
          <p className={styles.sectionSubtitle}>
            A comprehensive toolkit designed for modern job seekers who refuse to settle for spreadsheets.
          </p>
        </div>

        <div className={`${styles.featuresGrid} ${styles.staggerChildren} ${featuresVisible ? styles.staggerVisible : ""}`}>
          <div className={styles.featureCard}>
            <div className={styles.featureIconBox}><LayoutDashboard size={24} /></div>
            <h3 className={styles.featureName}>Kanban Pipeline</h3>
            <p className={styles.featureText}>
              Drag and drop applications across Wishlist, Applied, Interview, Offer, Rejected, and Ghosted with buttery smooth optimistic updates.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIconBox}><Brain size={24} /></div>
            <h3 className={styles.featureName}>AI Job Analyzer</h3>
            <p className={styles.featureText}>
              Paste any job description and let AI extract company, salary, requirements, and calculate your resume match score instantly.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIconBox}><Upload size={24} /></div>
            <h3 className={styles.featureName}>Resume Parser</h3>
            <p className={styles.featureText}>
              Upload PDF resumes to a private storage bucket. Text is extracted server-side and cached for instant AI matching against job postings.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIconBox}><BarChart3 size={24} /></div>
            <h3 className={styles.featureName}>Real-time Analytics</h3>
            <p className={styles.featureText}>
              Visualize your pipeline with interactive pie charts, timeline graphs, and response rate breakdowns using Recharts.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIconBox}><ShieldCheck size={24} /></div>
            <h3 className={styles.featureName}>Row-Level Security</h3>
            <p className={styles.featureText}>
              All data is secured by Supabase RLS policies. Your applications, resumes, and settings are invisible to other users.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIconBox}><Zap size={24} /></div>
            <h3 className={styles.featureName}>Blazing Fast</h3>
            <p className={styles.featureText}>
              Built on Next.js 16 App Router with Turbopack, React 19, and server components for near-instant page loads.
            </p>
          </div>
        </div>
      </section>

      {/* ━━━ How It Works ━━━ */}
      <section className={styles.howItWorks} id="how-it-works" ref={howRef}>
        <div className={styles.howItWorksInner}>
          <div className={`${styles.reveal} ${howVisible ? styles.revealVisible : ""}`}>
            <p className={styles.sectionEyebrow}>How It Works</p>
            <h2 className={styles.sectionTitle}>Three steps to pipeline clarity</h2>
            <p className={`${styles.sectionSubtitle} ${styles.sectionSubtitleCenter}`}>
              From scattered notes to a structured, AI-enhanced job search in minutes.
            </p>
          </div>

          <div className={`${styles.stepsGrid} ${styles.staggerChildren} ${howVisible ? styles.staggerVisible : ""}`}>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>1</div>
              <h3 className={styles.stepTitle}>Add Applications</h3>
              <p className={styles.stepText}>
                Manually add jobs or paste a description and let AI auto-fill company, position, salary, and type for you.
              </p>
            </div>

            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>2</div>
              <h3 className={styles.stepTitle}>Track & Organize</h3>
              <p className={styles.stepText}>
                Drag cards across your Kanban board. Set priorities, schedule interviews, and add notes — all in real-time.
              </p>
            </div>

            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>3</div>
              <h3 className={styles.stepTitle}>Analyze & Win</h3>
              <p className={styles.stepText}>
                Use analytics dashboards and AI match scores to identify which roles best fit your skills and tailor your approach.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ Bento Grid Showcase ━━━ */}
      <section className={styles.bentoSection} id="showcase" ref={bentoRef}>
        <div className={`${styles.reveal} ${bentoVisible ? styles.revealVisible : ""}`}>
          <p className={styles.sectionEyebrow}>Showcase</p>
          <h2 className={styles.sectionTitle}>Designed for the details</h2>
          <p className={styles.sectionSubtitle}>
            Every interaction feels intentional. Every pixel serves a purpose.
          </p>
        </div>

        <div className={`${styles.bentoGrid} ${styles.staggerChildren} ${bentoVisible ? styles.staggerVisible : ""}`}>
          {/* Wide card — AI Match */}
          <div className={`${styles.bentoCard} ${styles.bentoCardWide}`}>
            <div className={styles.bentoTitle}>
              <Sparkles size={16} style={{ display: "inline", verticalAlign: "middle", marginRight: 8, color: "var(--accent)" }} />
              AI Resume Match Score
            </div>
            <div className={styles.bentoText}>
              Paste a job description, enable resume comparison, and get an instant match percentage with skill gap analysis.
            </div>
            <div className={styles.bentoVisual}>
              <div className={styles.miniGauge}>
                <div className={styles.gaugeCircle}>
                  <svg width="90" height="90" viewBox="0 0 90 90">
                    <circle cx="45" cy="45" r="36" className={styles.gaugeBg} strokeWidth="6" fill="none" />
                    <circle
                      cx="45" cy="45" r="36"
                      className={styles.gaugeFill}
                      strokeWidth="6" fill="none"
                      strokeDasharray={2 * Math.PI * 36}
                      strokeDashoffset={bentoVisible ? 2 * Math.PI * 36 * (1 - 0.87) : 2 * Math.PI * 36}
                      strokeLinecap="round"
                      transform="rotate(-90 45 45)"
                    />
                  </svg>
                  <div className={styles.gaugePercent}>87%</div>
                </div>
                <div className={styles.gaugeMeta}>
                  <span className={styles.gaugeMetaLabel}>Excellent Match</span>
                  <span className={styles.gaugeMetaValue}>12/14 skills matched</span>
                </div>
              </div>
            </div>
          </div>

          {/* Narrow card — Drag & Drop */}
          <div className={`${styles.bentoCard} ${styles.bentoCardNarrow}`}>
            <div className={styles.bentoTitle}>
              <MousePointerClick size={16} style={{ display: "inline", verticalAlign: "middle", marginRight: 8, color: "hsl(38, 92%, 50%)" }} />
              Drag & Drop
            </div>
            <div className={styles.bentoText}>
              Move applications between pipeline stages with smooth drag-and-drop powered by DnD Kit. Optimistic updates keep things instant.
            </div>
          </div>

          {/* Half card — Analytics */}
          <div className={`${styles.bentoCard} ${styles.bentoCardHalf}`}>
            <div className={styles.bentoTitle}>
              <TrendingUp size={16} style={{ display: "inline", verticalAlign: "middle", marginRight: 8, color: "hsl(142, 71%, 45%)" }} />
              Application Timeline
            </div>
            <div className={styles.bentoText}>
              Track your application volume over time with cumulative area charts and spot trends in your job search momentum.
            </div>
            <div className={styles.bentoVisual}>
              <div className={styles.miniBars}>
                {[40, 65, 55, 80, 70, 90, 60, 85].map((h, i) => (
                  <div
                    key={i}
                    className={styles.miniBar}
                    style={{
                      height: bentoVisible ? `${h}%` : "0%",
                      background: `hsl(${250 + i * 5}, 75%, ${60 + i * 2}%)`,
                      transitionDelay: `${i * 0.1}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Half card — Security */}
          <div className={`${styles.bentoCard} ${styles.bentoCardHalf}`}>
            <div className={styles.bentoTitle}>
              <Lock size={16} style={{ display: "inline", verticalAlign: "middle", marginRight: 8, color: "hsl(142, 71%, 45%)" }} />
              Enterprise-Grade Security
            </div>
            <div className={styles.bentoText}>
              Built on Supabase with Row-Level Security, Google OAuth, email/password authentication, and private storage buckets for your resumes.
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ CTA Section ━━━ */}
      <section className={styles.ctaSection} ref={ctaRef}>
        <div className={styles.ctaOrb} />
        <div className={styles.ctaOrb} />
        <div className={`${styles.ctaContent} ${styles.revealScale} ${ctaVisible ? styles.revealScaleVisible : ""}`}>
          <h2 className={styles.ctaTitle}>
            Ready to take control of <br />
            <span className={styles.heroTitleGradient}>your job search?</span>
          </h2>
          <p className={styles.ctaSubtitle}>
            Join TrackHire and transform your scattered job hunt into a streamlined, AI-powered pipeline.
          </p>
          <div className={styles.heroCtas}>
            {isLoggedIn ? (
              <Link href="/dashboard" className={styles.btnLarge}>
                Open Dashboard <ArrowRight size={20} />
              </Link>
            ) : (
              <>
                <Link href="/signup" className={styles.btnLarge}>
                  Get Started for Free <ArrowRight size={20} />
                </Link>
                <Link href="/login" className={styles.btnLargeOutline}>
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ━━━ Footer ━━━ */}
      <footer className={styles.footer} ref={footerRef}>
        <div className={`${styles.footerInner} ${styles.reveal} ${footerVisible ? styles.revealVisible : ""}`}>
          <div className={styles.footerBrand}>
            <Link href="/" className={styles.logo}>
              <span className={styles.logoIcon}>T</span>
              <span className={styles.logoText}>TrackHire</span>
            </Link>
            <p className={styles.footerBrandDesc}>
              An AI-powered, full-stack job application tracker built with Next.js, Supabase, and Groq.
            </p>
          </div>

          <div className={styles.footerLinks}>
            <div className={styles.footerColumn}>
              <h4>Product</h4>
              <a href="#features">Features</a>
              <a href="#how-it-works">How It Works</a>
              <a href="#showcase">Showcase</a>
            </div>
            <div className={styles.footerColumn}>
              <h4>Account</h4>
              <Link href="/login">Sign In</Link>
              <Link href="/signup">Create Account</Link>
              <Link href="/dashboard">Dashboard</Link>
            </div>
          </div>
        </div>

        <div className={styles.footerDivider} />

        <div className={styles.footerBottom}>
          <span className={styles.footerCopy}>
            &copy; {new Date().getFullYear()} TrackHire. All rights reserved.
          </span>
          <span className={styles.footerDevCredit}>
            Developed with <Heart size={13} style={{ display: "inline", verticalAlign: "middle", color: "hsl(0, 84%, 60%)", fill: "hsl(0, 84%, 60%)" }} /> by{" "}
            <span className={styles.footerDevName}>Haseeb Akram</span>
          </span>
        </div>
      </footer>
    </div>
  );
}
