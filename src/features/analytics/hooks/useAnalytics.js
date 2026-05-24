"use client";

import { useMemo } from "react";
import { useApplications } from "../../applications/hooks/useApplications";
import { computeStats } from "../computeStats";

/**
 * Client-side analytics hook. Wraps useApplications and computes stats
 * using the shared computeStats utility. The analytics page itself uses
 * server-side computation, but this hook is available for any client
 * component that needs live-updating analytics (e.g. dashboard widgets).
 */
export function useAnalytics() {
  const { applications, loading, error } = useApplications();

  const stats = useMemo(() => {
    return computeStats(applications);
  }, [applications]);

  return { loading, error, stats };
}
