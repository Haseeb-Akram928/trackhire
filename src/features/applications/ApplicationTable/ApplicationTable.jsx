"use client";

import React, { useState, useMemo } from "react";
import { Search, ArrowUpDown, Filter, Edit2, Calendar, MapPin, Briefcase } from "lucide-react";
import { STATUSES, PRIORITIES } from "@/utils/constants";
import { Badge } from "@/components/ui/Badge/Badge";
import { Input } from "@/components/ui/Input/Input";
import { EmptyState } from "@/components/ui/EmptyState/EmptyState";
import { formatDate } from "@/utils/helpers";
import styles from "./ApplicationTable.module.css";

export function ApplicationTable({ applications = [], onRowClick }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  
  // Sort state
  const [sortField, setSortField] = useState("applied_at");
  const [sortDirection, setSortDirection] = useState("desc");

  // Handle header sorting click
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Filter and sort applications
  const processedApplications = useMemo(() => {
    let result = [...applications];

    // 1. Apply Search
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (app) =>
          app.company.toLowerCase().includes(term) ||
          app.position.toLowerCase().includes(term) ||
          (app.location && app.location.toLowerCase().includes(term))
      );
    }

    // 2. Apply Status Filter
    if (statusFilter !== "all") {
      result = result.filter((app) => app.status === statusFilter);
    }

    // 3. Apply Priority Filter
    if (priorityFilter !== "all") {
      result = result.filter((app) => app.priority === priorityFilter);
    }

    // 4. Apply Sorting
    result.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      // Always push null/undefined values to the end regardless of sort direction
      if (valA === null || valA === undefined) return 1;
      if (valB === null || valB === undefined) return -1;

      if (sortField === "applied_at") {
        return sortDirection === "asc"
          ? new Date(valA) - new Date(valB)
          : new Date(valB) - new Date(valA);
      }

      if (typeof valA === "string") {
        return sortDirection === "asc"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }

      // Default number comparison
      return sortDirection === "asc" ? valA - valB : valB - valA;
    });

    return result;
  }, [applications, searchTerm, statusFilter, priorityFilter, sortField, sortDirection]);

  return (
    <div className={styles.container}>
      {/* Search & Filter Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.searchWrapper}>
          <Search className={styles.searchIcon} size={18} />
          <input
            type="text"
            placeholder="Search company, role, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <Filter size={14} className={styles.filterIcon} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">All Statuses</option>
              {STATUSES.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.label}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <Filter size={14} className={styles.filterIcon} />
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">All Priorities</option>
              {PRIORITIES.map((pr) => (
                <option key={pr.id} value={pr.id}>
                  {pr.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className={styles.tableWrapper}>
        {processedApplications.length > 0 ? (
          <table className={styles.table}>
            <thead>
              <tr>
                <th onClick={() => handleSort("company")}>
                  <div className={styles.headerCell}>
                    Company <ArrowUpDown size={14} />
                  </div>
                </th>
                <th onClick={() => handleSort("position")}>
                  <div className={styles.headerCell}>
                    Position <ArrowUpDown size={14} />
                  </div>
                </th>
                <th onClick={() => handleSort("location")}>
                  <div className={styles.headerCell}>
                    Location <ArrowUpDown size={14} />
                  </div>
                </th>
                <th onClick={() => handleSort("applied_at")}>
                  <div className={styles.headerCell}>
                    Date Applied <ArrowUpDown size={14} />
                  </div>
                </th>
                <th onClick={() => handleSort("priority")}>
                  <div className={styles.headerCell}>
                    Priority <ArrowUpDown size={14} />
                  </div>
                </th>
                <th onClick={() => handleSort("status")}>
                  <div className={styles.headerCell}>
                    Status <ArrowUpDown size={14} />
                  </div>
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {processedApplications.map((app) => (
                <tr key={app.id} onClick={() => onRowClick(app)} className={styles.row}>
                  <td className={styles.boldCell}>{app.company}</td>
                  <td>{app.position}</td>
                  <td>
                    {app.location ? (
                      <span className={styles.locationCell}>
                        <MapPin size={12} /> {app.location}
                      </span>
                    ) : (
                      <span className={styles.placeholderCell}>—</span>
                    )}
                  </td>
                  <td>
                    {app.applied_at ? (
                      <span className={styles.dateCell}>
                        <Calendar size={12} /> {formatDate(app.applied_at)}
                      </span>
                    ) : (
                      <span className={styles.placeholderCell}>—</span>
                    )}
                  </td>
                  <td>
                    <Badge type="priority" value={app.priority || "medium"} />
                  </td>
                  <td>
                    <Badge type="status" value={app.status} />
                  </td>
                  <td>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRowClick(app);
                      }}
                      className={styles.editBtn}
                      title="Edit Application"
                    >
                      <Edit2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className={styles.emptyContainer}>
            <EmptyState
              icon={<Briefcase size={24} />}
              title="No Matching Applications"
              description={
                searchTerm || statusFilter !== "all" || priorityFilter !== "all"
                  ? "Adjust your filters or search terms to find what you are looking for."
                  : "You haven't tracked any job applications yet."
              }
            />
          </div>
        )}
      </div>
    </div>
  );
}
