import { STATUSES } from "@/utils/constants";

/**
 * Returns the ISO date string (YYYY-MM-DD) of the Monday that starts the
 * week containing the given date string.
 */
function getWeekStart(dateStr) {
  const date = new Date(dateStr + "T00:00:00Z");
  const day = date.getUTCDay(); // 0=Sunday, 1=Monday, ..., 6=Saturday
  const diff = day === 0 ? -6 : 1 - day; // Shift back to Monday
  const monday = new Date(date);
  monday.setUTCDate(date.getUTCDate() + diff);
  return monday.toISOString().split("T")[0];
}

/**
 * Pure function that computes analytics stats from an array of applications.
 * Shared between the server-side analytics page and the useAnalytics client hook.
 *
 * @param {Array} applications - Raw application objects from Supabase
 * @returns {object} Computed stats: totals, rates, distributions, timeline, response data
 */
export function computeStats(applications) {
  if (!applications || applications.length === 0) {
    return {
      total: 0,
      interviewRate: 0,
      offerRate: 0,
      activeThisWeek: 0,
      statusDistribution: [],
      timelineData: [],
      responseRateData: [],
    };
  }

  const total = applications.length;

  // 1. Status counts
  const wishlistCount = applications.filter((a) => a.status === "wishlist").length;
  const interviewCount = applications.filter((a) => a.status === "interview").length;
  const offerCount = applications.filter((a) => a.status === "offer").length;
  const rejectedCount = applications.filter((a) => a.status === "rejected").length;
  const ghostedCount = applications.filter((a) => a.status === "ghosted").length;
  const appliedCount = applications.filter((a) => a.status === "applied").length;

  // 2. Rates
  const nonWishlistCount = total - wishlistCount;
  const interviewRate =
    nonWishlistCount > 0
      ? Math.round(((interviewCount + offerCount) / nonWishlistCount) * 100)
      : 0;
  const offerRate = total > 0 ? Math.round((offerCount / total) * 100) : 0;

  // 3. Active this week (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const activeThisWeek = applications.filter((a) => {
    if (!a.applied_at) return false;
    return new Date(a.applied_at) >= sevenDaysAgo;
  }).length;

  // 4. Status distribution for PieChart
  const statusDistribution = STATUSES.map((status) => ({
    name: status.label,
    value: applications.filter((a) => a.status === status.id).length,
    color: status.color,
  })).filter((item) => item.value > 0);

  // 5. Timeline data grouped by week (#12)
  const weekMap = {};
  applications.forEach((a) => {
    if (!a.applied_at) return;
    const weekStart = getWeekStart(a.applied_at);
    weekMap[weekStart] = (weekMap[weekStart] || 0) + 1;
  });

  const sortedWeeks = Object.keys(weekMap).sort((a, b) => new Date(a) - new Date(b));
  let cumulative = 0;
  const timelineData = sortedWeeks.map((weekStartStr) => {
    cumulative += weekMap[weekStartStr];
    const formatted = new Date(weekStartStr + "T00:00:00Z").toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    });
    return {
      dateStr: `Wk ${formatted}`,
      Applications: weekMap[weekStartStr],
      Cumulative: cumulative,
    };
  });

  // 6. Response rates bar data
  const respondedCount = interviewCount + offerCount;
  const responseRateData = [
    {
      name: "Outcomes",
      Responded: respondedCount,
      Rejected: rejectedCount,
      Ghosted: ghostedCount,
      Applied: appliedCount,
    },
  ];

  return {
    total,
    interviewRate,
    offerRate,
    activeThisWeek,
    statusDistribution,
    timelineData,
    responseRateData,
  };
}
