"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";

const DEBOUNCE_MS = 300;
const MAX_RESULTS = 8;

/**
 * Hook for global search across the user's applications.
 * Debounces the query and searches company, position, and location columns.
 */
export function useGlobalSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const supabase = useMemo(() => createClient(), []);
  const debounceTimer = useRef(null);

  // Perform the Supabase search
  const performSearch = useCallback(
    async (searchTerm) => {
      if (!searchTerm.trim()) {
        setResults([]);
        setIsOpen(false);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setLoading(false);
          return;
        }

        // Use ilike for case-insensitive partial matching on multiple columns
        // Supabase .or() filter with ilike patterns
        const term = `%${searchTerm.trim()}%`;

        const { data, error } = await supabase
          .from("applications")
          .select("id, company, position, status, location, priority, applied_at")
          .eq("user_id", user.id)
          .or(`company.ilike.${term},position.ilike.${term},location.ilike.${term}`)
          .order("updated_at", { ascending: false })
          .limit(MAX_RESULTS);

        if (error) {
          console.error("Global search error:", error);
          setResults([]);
        } else {
          setResults(data || []);
          setIsOpen(true);
        }
      } catch (err) {
        console.error("Global search failed:", err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    },
    [supabase]
  );

  // Debounce the search query
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (!query.trim()) {
      setResults([]);
      setIsOpen(false);
      setLoading(false);
      return;
    }

    // Show loading state immediately for responsiveness
    setLoading(true);

    debounceTimer.current = setTimeout(() => {
      performSearch(query);
    }, DEBOUNCE_MS);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [query, performSearch]);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const clear = useCallback(() => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
    setLoading(false);
  }, []);

  return {
    query,
    setQuery,
    results,
    loading,
    isOpen,
    close,
    clear,
  };
}
