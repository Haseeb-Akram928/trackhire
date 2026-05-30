"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Search, Bell, User, LogOut, Settings, MapPin, Briefcase, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/useAuth";
import { useGlobalSearch } from "./useGlobalSearch";
import { Badge } from "@/components/ui/Badge/Badge";
import styles from "./Topbar.module.css";

export function Topbar({ user }) {
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const { logout } = useAuth();

  // Global search hook
  const { query, setQuery, results, loading, isOpen, close, clear } = useGlobalSearch();
  const searchInputRef = useRef(null);
  const searchWrapperRef = useRef(null);

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

  // Click outside handlers — close profile/notification dropdowns AND search dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (actionsRef.current && !actionsRef.current.contains(event.target)) {
        setIsProfileOpen(false);
        setIsNotificationsOpen(false);
      }
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(event.target)) {
        close();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [close]);

  // Ctrl+K / Cmd+K keyboard shortcut to focus search
  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Handle Escape key on search input
  const handleSearchKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") {
        close();
        searchInputRef.current?.blur();
      }
    },
    [close]
  );

  // Click on a search result → navigate to applications page and close
  const handleResultClick = useCallback(
    (app) => {
      clear();
      searchInputRef.current?.blur();
      router.push("/applications");
    },
    [clear, router]
  );

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
      <div className={styles.searchWrapper} ref={searchWrapperRef}>
        <Search className={styles.searchIcon} size={18} />
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Search applications, companies, roles..."
          className={styles.searchInput}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleSearchKeyDown}
          onFocus={() => {
            // Re-open dropdown if there's a query with results
            if (query.trim() && results.length > 0) {
              // isOpen will be managed by the hook
            }
          }}
        />

        {/* Keyboard shortcut hint — only show when input is empty and unfocused */}
        {!query && (
          <span className={styles.searchShortcut}>
            <kbd>Ctrl</kbd>
            <kbd>K</kbd>
          </span>
        )}

        {/* Clear button when query has text */}
        {query && (
          <button
            className={styles.searchClearBtn}
            onClick={() => {
              clear();
              searchInputRef.current?.focus();
            }}
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        )}

        {/* Search Results Dropdown */}
        {isOpen && query.trim() && (
          <div className={styles.searchDropdown}>
            {loading ? (
              <div className={styles.searchLoading}>
                <div className={styles.searchSpinner} />
                <span>Searching applications…</span>
              </div>
            ) : results.length > 0 ? (
              <div className={styles.searchResults}>
                <div className={styles.searchDropdownHeader}>
                  <span className={styles.searchDropdownTitle}>Applications</span>
                  <span className={styles.searchResultCount}>{results.length} found</span>
                </div>
                {results.map((app) => (
                  <button
                    key={app.id}
                    className={styles.searchResultItem}
                    onClick={() => handleResultClick(app)}
                  >
                    <div className={styles.searchResultInfo}>
                      <span className={styles.searchResultCompany}>{app.company}</span>
                      <span className={styles.searchResultPosition}>{app.position}</span>
                    </div>
                    <div className={styles.searchResultMeta}>
                      <Badge type="status" value={app.status} />
                      {app.location && (
                        <span className={styles.searchResultLocation}>
                          <MapPin size={11} />
                          {app.location}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className={styles.searchEmpty}>
                <Briefcase size={22} />
                <span className={styles.searchEmptyTitle}>No results found</span>
                <span className={styles.searchEmptySubtext}>
                  Try a different company name, role, or location.
                </span>
              </div>
            )}
          </div>
        )}

        {/* Loading indicator when dropdown is not yet open but loading */}
        {loading && !isOpen && query.trim() && (
          <div className={styles.searchDropdown}>
            <div className={styles.searchLoading}>
              <div className={styles.searchSpinner} />
              <span>Searching applications…</span>
            </div>
          </div>
        )}
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
