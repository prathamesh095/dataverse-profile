// components/skills/Controls.tsx
"use client";

import React, { memo, useMemo } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Grid3X3, List, Search as SearchIcon, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/lib/hooks-debounce"; // small debounce hook (will provide below)
import { useDeferredValue } from "react";

type SkillCategory = any;

export const Controls = memo(function Controls({
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  allSkillsWithCategory,
  skillCategories,
  viewMode,
  setViewMode,
}: {
  selectedCategory: string;
  setSelectedCategory: (s: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  sortBy: "level" | "projects" | "certifications";
  setSortBy: (s: "level" | "projects" | "certifications") => void;
  allSkillsWithCategory: any[];
  skillCategories: SkillCategory[];
  viewMode: "grid" | "list";
  setViewMode: (v: "grid" | "list") => void;
}) {
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const deferred = useDeferredValue(debouncedSearchQuery);

  return (
    <div className="flex flex-col lg:flex-row gap-4 items-end justify-between">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 flex-1 w-full lg:w-auto">
        <div className="flex-1">
          <label htmlFor="category-select" className="sr-only">Select category</label>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger id="category-select" className="bg-muted/80 backdrop-blur-sm border border-primary/30">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent className="max-h-96 overflow-y-auto">
              <SelectItem value="all">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-linear-to-br from-primary to-secondary rounded" />
                  All Skills ({allSkillsWithCategory.length})
                </div>
              </SelectItem>
              {skillCategories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  <div className="flex items-center gap-2">
                    <category.icon className="w-4 h-4 text-primary" aria-hidden />
                    {category.title} ({category.skills.length})
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 relative">
          <label htmlFor="search-input" className="sr-only">Search skills</label>
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" aria-hidden />
          <Input id="search-input" placeholder="Search skills..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 bg-muted/80 backdrop-blur-sm border border-primary/30 placeholder:text-muted-foreground/60" />
        </div>

        <div className="flex gap-2" role="group" aria-label="Sort by">
          {(["level", "projects", "certifications"] as const).map((sort) => (
            <button key={sort} type="button" onClick={() => setSortBy(sort)} className={cn("flex-1 px-3 py-2 rounded-lg font-medium text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2", sortBy === sort ? "bg-linear-to-r from-primary to-secondary text-white shadow-md" : "bg-muted/80 backdrop-blur-sm text-primary border border-primary/30 hover:bg-primary/10")} aria-pressed={sortBy === sort} aria-label={`Sort by ${sort}`}>
              {sort.charAt(0).toUpperCase() + sort.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="flex bg-muted/50 rounded-lg p-1 shadow-inner w-full lg:w-auto">
        <button onClick={() => setViewMode("grid")} className={cn("flex-1 lg:flex-none px-4 py-2 rounded-md flex items-center justify-center gap-2 transition-all", viewMode === "grid" ? "bg-background shadow-md text-primary" : "text-muted-foreground")} aria-label="Grid view">
          <Grid3X3 className="w-4 h-4" />
          <span className="lg:hidden">Grid</span>
        </button>
        <button onClick={() => setViewMode("list")} className={cn("flex-1 lg:flex-none px-4 py-2 rounded-md flex items-center justify-center gap-2 transition-all", viewMode === "list" ? "bg-background shadow-md text-primary" : "text-muted-foreground")} aria-label="List view">
          <List className="w-4 h-4" />
          <span className="lg:hidden">List</span>
        </button>
      </div>
    </div>
  );
});
Controls.displayName = "Controls";
