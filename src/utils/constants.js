/**
 * Application Status Columns — used by Kanban board and Badge component.
 * The `color` values match the CSS variables defined in globals.css.
 */
export const STATUSES = [
  { id: "wishlist",  label: "Wishlist",  color: "hsl(263, 70%, 58%)" },
  { id: "applied",   label: "Applied",   color: "hsl(217, 91%, 60%)" },
  { id: "interview", label: "Interview", color: "hsl(38, 92%, 50%)"  },
  { id: "offer",     label: "Offer",     color: "hsl(142, 71%, 45%)" },
  { id: "rejected",  label: "Rejected",  color: "hsl(0, 84%, 60%)"   },
  { id: "ghosted",   label: "Ghosted",   color: "hsl(220, 9%, 46%)"  },
];

/**
 * Application Priority Levels — used by Kanban cards, forms, and Badge component.
 */
export const PRIORITIES = [
  { id: "low",    label: "Low",    color: "hsl(215, 15%, 60%)" },
  { id: "medium", label: "Medium", color: "hsl(38, 92%, 50%)"  },
  { id: "high",   label: "High",   color: "hsl(0, 84%, 60%)"   },
];

/**
 * Job Type Options — used by ApplicationForm select dropdowns.
 */
export const JOB_TYPES = [
  { id: "full-time",  label: "Full-time"  },
  { id: "part-time",  label: "Part-time"  },
  { id: "contract",   label: "Contract"   },
  { id: "internship", label: "Internship" },
];

/**
 * Default gap-based position index step for Kanban ordering.
 * Cards are inserted at multiples of this to allow midpoint ordering.
 */
export const POSITION_GAP = 1000;
