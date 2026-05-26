"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/features/auth/useAuth";
import {
  LayoutDashboard,
  Briefcase,
  BarChart3,
  Sparkles,
  Settings,
  LogOut,
} from "lucide-react";
import styles from "./Sidebar.module.css";

const MENU_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Applications", href: "/applications", icon: Briefcase },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "AI Parser", href: "/ai-parser", icon: Sparkles },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <>
      {/* ━━━ Desktop Sidebar ━━━ */}
      <aside className={styles.sidebar}>
        <div className={styles.logoWrapper}>
          <Link href="/dashboard" className={styles.logoLink}>
            <span className={styles.logoIcon}>T</span>
            <span className={styles.logoText}>TrackHire</span>
          </Link>
        </div>

        <nav className={styles.nav}>
          <ul className={styles.navList}>
            {MENU_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`${styles.navLink} ${isActive ? styles.active : ""}`}
                  >
                    <Icon size={20} className={styles.icon} />
                    <span className={styles.label}>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className={styles.footer}>
          <button onClick={logout} className={styles.logoutButton}>
            <LogOut size={20} className={styles.icon} />
            <span className={styles.label}>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ━━━ Mobile Bottom Navigation ━━━ */}
      <nav className={styles.bottomNav} aria-label="Mobile navigation">
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.bottomNavItem} ${isActive ? styles.bottomNavItemActive : ""}`}
            >
              <Icon size={20} className={styles.bottomNavIcon} />
              <span className={styles.bottomNavLabel}>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
