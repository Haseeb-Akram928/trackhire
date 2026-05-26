"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, Bell, User, LogOut, Settings } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/features/auth/useAuth";
import styles from "./Topbar.module.css";

export function Topbar({ user }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const { logout } = useAuth();

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Resume parsed successfully!",
      message: "AI parser completed rating for Google Frontend Engineer role.",
      time: "2 hours ago",
      unread: true,
    },
    {
      id: 2,
      title: "Status Update",
      message: "Google application moved to 'Interview' phase.",
      time: "1 day ago",
      unread: true,
    },
    {
      id: 3,
      title: "Welcome to TrackHire 🎉",
      message: "Start tracking your career goals and visualize your pipeline.",
      time: "3 days ago",
      unread: false,
    },
  ]);

  const actionsRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (actionsRef.current && !actionsRef.current.contains(event.target)) {
        setIsProfileOpen(false);
        setIsNotificationsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Get user display email or name
  const userEmail = user?.email || "User";
  const userDisplayName = user?.user_metadata?.full_name || userEmail.split("@")[0];

  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleMarkAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, unread: false })));
  };

  const handleNotificationClick = (id) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

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

      <div className={styles.actions} ref={actionsRef}>
        {/* Notification Dropdown Container */}
        <div className={styles.notificationContainer}>
          <button 
            className={`${styles.notificationBtn} ${isNotificationsOpen ? styles.btnActive : ""}`} 
            onClick={() => {
              setIsNotificationsOpen(!isNotificationsOpen);
              setIsProfileOpen(false);
            }}
            aria-expanded={isNotificationsOpen}
            aria-label="Notifications"
          >
            <Bell size={20} />
            {unreadCount > 0 && <span className={styles.badge}>{unreadCount}</span>}
          </button>

          {isNotificationsOpen && (
            <div className={styles.notificationsDropdown}>
              <div className={styles.dropdownHeader}>
                <span className={styles.dropdownTitle}>Notifications</span>
                {unreadCount > 0 && (
                  <button onClick={handleMarkAllRead} className={styles.markAllBtn}>
                    Mark all as read
                  </button>
                )}
              </div>
              <div className={styles.notificationsList}>
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <button
                      key={n.id}
                      className={`${styles.notificationItem} ${n.unread ? styles.notificationItemUnread : ""}`}
                      onClick={() => handleNotificationClick(n.id)}
                    >
                      <span className={styles.notificationItemTitle}>{n.title}</span>
                      <span className={styles.notificationItemMessage}>{n.message}</span>
                      <span className={styles.notificationItemTime}>{n.time}</span>
                    </button>
                  ))
                ) : (
                  <div className={styles.emptyNotifications}>
                    <Bell size={24} />
                    <span className={styles.emptyText}>All caught up!</span>
                    <span className={styles.emptySubtext}>
                      We'll notify you when your applications change status or when AI parsing completes.
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown Container */}
        <div className={styles.profileContainer}>
          <button 
            className={`${styles.userProfile} ${isProfileOpen ? styles.profileActive : ""}`}
            onClick={() => {
              setIsProfileOpen(!isProfileOpen);
              setIsNotificationsOpen(false);
            }}
            aria-expanded={isProfileOpen}
            aria-label="User menu"
          >
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
          </button>

          {isProfileOpen && (
            <div className={styles.profileDropdown}>
              <div className={styles.dropdownUserHeader}>
                <span className={styles.dropdownUserName}>{userDisplayName}</span>
                <span className={styles.dropdownUserEmail}>{userEmail}</span>
              </div>
              <div className={styles.dropdownMenu}>
                <Link 
                  href="/settings" 
                  className={styles.dropdownItem}
                  onClick={() => setIsProfileOpen(false)}
                >
                  <Settings size={16} />
                  <span>Settings</span>
                </Link>
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    logout();
                  }}
                  className={`${styles.dropdownItem} ${styles.dropdownItemLogout}`}
                >
                  <LogOut size={16} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
