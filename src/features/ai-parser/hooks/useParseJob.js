"use client";

import { useState, useCallback } from "react";
import { toast } from "react-hot-toast";

export function useParseJob() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [parsedData, setParsedData] = useState(null);

  const parseJob = useCallback(async (jobDescription, compareResume = false) => {
    setLoading(true);
    setError(null);
    setParsedData(null);
    try {
      const res = await fetch("/api/ai/parse-job", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobDescription,
          compareResume,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json?.error || "Failed to analyze job description");
      }

      setParsedData(json?.data || null);
      toast.success("Job description analyzed successfully!");
      return json?.data;
    } catch (err) {
      console.error("Error in parseJob hook:", err);
      setError(err.message);
      toast.error(err.message || "Failed to analyze job description");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setParsedData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    loading,
    error,
    parsedData,
    parseJob,
    reset,
  };
}
