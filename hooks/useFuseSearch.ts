// hooks/useFuseSearch.ts
"use client";

import { useEffect, useMemo, useState } from "react";
import Fuse, { IFuseOptions } from "fuse.js";

/**
 * Build a Fuse index and provide a search function.
 * data: array of documents
 * options: Fuse options
 */
export function useFuseSearch<T extends Record<string, any>>(data: T[] | null, options?: IFuseOptions<T>) {
  const fuse = useMemo(() => {
    if (!data || data.length === 0) return null;
    // Create lightweight index to speed up searches
    try {
      const defaultOpts: IFuseOptions<T> = {
        keys: ["title", "keywords"],
        threshold: 0.35,
        distance: 100,
        minMatchCharLength: 2,
        includeScore: true,
      };
      return new Fuse<T>(data, { ...(defaultOpts as any), ...(options || {}) });
    } catch {
      return null;
    }
  }, [data, options]);

  const search = (q: string) => {
    if (!fuse || !q) return data ?? [];
    try {
      const results = fuse.search(q);
      return results.map((r) => r.item);
    } catch {
      const lower = q.toLowerCase();
      return (data || []).filter(
        (d) =>
          (d.title || "").toString().toLowerCase().includes(lower) ||
          (Array.isArray(d.keywords) && d.keywords.join(" ").toLowerCase().includes(lower))
      );
    }
  };

  return { search, ready: !!fuse };
}
