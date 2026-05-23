"use client";

import React from "react";
import { Search, Bell, User } from "lucide-react";
import Image from "next/image";
import styles from "./Topbar.module.css";

export function Topbar({ user }) {
  // Get user display email or name
  const userEmail = user?.email || "User";
  const userDisplayName = user?.user_metadata?.full_name || userEmail.split("@")[0];

  return (
    <header className={styles.topbar}>
      <div className={styles.searchWrapper}>
        <Search className={styles.searchIcon} size={18} />
        <input
          type="text"
          placeholder="Search applications, companies, roles..."
          className={styles.searchInput}
        />
      </div>

      <div className={styles.actions}>
        <button className={styles.notificationBtn} aria-label="Notifications">
          <Bell size={20} />
          <span className={styles.badge} />
        </button>

        <div className={styles.userProfile}>
          <div className={styles.avatar}>
            {user?.user_metadata?.avatar_url ? (
              <Image
                src={user.user_metadata.avatar_url}
                alt={userDisplayName}
                width={38}
                height={38}
                className={styles.avatarImg}
              />
            ) : (
              <User size={18} className={styles.avatarPlaceholder} />
            )}
          </div>
          <div className={styles.userInfo}>
            <span className={styles.userName}>{userDisplayName}</span>
            <span className={styles.userRole}>Job Seeker</span>
          </div>
        </div>
      </div>
    </header>
  );
}
