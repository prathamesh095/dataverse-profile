"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StatsCard } from "./StatsCard";
import { SkillCard } from "./SkillCard";
import { SkillListRow } from "./SkillListRow";
import { Controls } from "./Controls";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useFuseSearch } from "@/hooks/useFuseSearch";
import { useDebounce } from "@/lib/hooks-debounce";
import { skillCategories as _skillCategories } from "@/lib/skills";
import type { Skill, SkillCategory } from "@/lib/skills";
import { Zap, TrendingUp, Award, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

// --------------------------------------------------
// Type Extensions
// --------------------------------------------------
type ExtendedSkill = Skill & {
  category: string;
  certifications?: number;
  tags?: string[];
  description?: string;
  technologies?: string[];
};

// --------------------------------------------------
// Component: SkillsMatrix
// --------------------------------------------------
export function SkillsMatrix() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"level" | "projects" | "certifications">("level");
  const [maxSkills, setMaxSkills] = useState(12);
  const [viewMode, setViewMode] = useLocalStorage<"grid" | "list">("skills:viewMode", "grid");

  const debouncedSearch = useDebounce(searchQuery, 250);

  // SSR-safe category loading
  const skillCategories: SkillCategory[] =
    typeof window !== "undefined"
      ? require("@/lib/skills").skillCategories
      : _skillCategories;

  // Flatten categories → skills
  const allSkillsWithCategory = useMemo(() => {
    return skillCategories.flatMap((cat: SkillCategory) =>
      (cat.skills || []).map(
        (s: Skill) => ({ ...s, category: cat.id } as ExtendedSkill)
      )
    );
  }, [skillCategories]);

  if (!allSkillsWithCategory.length) {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-muted-foreground" role="alert">
            No skills available. Please check the data source.
          </p>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // Fuzzy Search Setup (Fuse.js)
  // --------------------------------------------------
  const fuseDocs = useMemo(
    () =>
      allSkillsWithCategory.map((s) => ({
        title: s.name,
        keywords: [
          s.tags?.join(" ") || "",
          s.description || "",
          s.technologies?.join(" ") || "",
        ],
        ref: s,
      })),
    [allSkillsWithCategory]
  );

  const { search: fuseSearch } = useFuseSearch(fuseDocs, {
    keys: ["title", "keywords"],
    threshold: 0.35,
  });

  // --------------------------------------------------
  // Stats + Filtering
  // --------------------------------------------------
  const filteredForStats = useMemo(() => {
    const base =
      selectedCategory === "all"
        ? allSkillsWithCategory
        : allSkillsWithCategory.filter((s) => s.category === selectedCategory);

    if (!debouncedSearch) return base;

    const results = fuseSearch(debouncedSearch);
    const refs = results.map((r: any) => r.ref).filter(Boolean) as ExtendedSkill[];
    return base.filter((s) => refs.some((r) => r.name === s.name));
  }, [allSkillsWithCategory, selectedCategory, debouncedSearch, fuseSearch]);

  const stats = useMemo(() => {
    const skills = filteredForStats;
    const avgLevel = skills.length
      ? Math.round(skills.reduce((s, a) => s + a.level, 0) / skills.length)
      : 0;
    const totalProjects = skills.reduce((s, a) => s + (a.projects || 0), 0);
    const totalCertifications = skills.reduce(
      (s, a) => s + (a.certifications || 0),
      0
    );
    const expertSkills = skills.filter((s) => s.level >= 90).length;
    const totalSkills =
      selectedCategory === "all"
        ? allSkillsWithCategory.length
        : allSkillsWithCategory.filter((s) => s.category === selectedCategory)
            .length;

    return {
      avgLevel,
      totalProjects,
      totalCertifications,
      expertSkills,
      totalSkills,
      displayedSkills: skills.length,
    };
  }, [filteredForStats, selectedCategory, allSkillsWithCategory]);

  const filteredSkills = useMemo(() => {
    let set =
      selectedCategory === "all"
        ? allSkillsWithCategory.slice()
        : allSkillsWithCategory.filter((s) => s.category === selectedCategory);

    if (debouncedSearch) {
      const results = fuseSearch(debouncedSearch);
      const refs = results.map((r: any) => r.ref).filter(Boolean) as ExtendedSkill[];
      const names = new Set(refs.map((r) => r.name));
      set = set.filter((s) => names.has(s.name));
    }

    set.sort((a, b) => {
      switch (sortBy) {
        case "projects":
          return (b.projects || 0) - (a.projects || 0);
        case "certifications":
          return (b.certifications || 0) - (a.certifications || 0);
        case "level":
        default:
          return b.level - a.level;
      }
    });

    return set.slice(0, maxSkills);
  }, [
    allSkillsWithCategory,
    selectedCategory,
    debouncedSearch,
    sortBy,
    maxSkills,
    fuseSearch,
  ]);

  // --------------------------------------------------
  // Responsive max skills via ResizeObserver
  // --------------------------------------------------
  useEffect(() => {
    if (typeof window === "undefined" || typeof ResizeObserver === "undefined") {
      setMaxSkills(12);
      return;
    }
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width || window.innerWidth;
      setMaxSkills(w >= 1200 ? 12 : w >= 900 ? 9 : w >= 640 ? 8 : 6);
    });
    ro.observe(document.body);
    return () => ro.disconnect();
  }, []);

  // --------------------------------------------------
  // Helpers
  // --------------------------------------------------
  const getProficiencyColor = useCallback((level: number) => {
    if (level >= 90) return "from-primary to-secondary";
    if (level >= 80) return "from-status-info to-secondary";
    if (level >= 70) return "from-secondary to-tertiary";
    return "from-tertiary to-status-warning";
  }, []);

  const getProficiencyLabel = useCallback((level: number) => {
    if (level >= 90) return "Expert";
    if (level >= 80) return "Advanced";
    if (level >= 70) return "Intermediate";
    return "Beginner";
  }, []);

  const getCategoryColor = useCallback(
    () => "bg-linear-to-r from-primary/10 to-secondary/10",
    []
  );

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  return (
    <div
      className="min-h-screen py-12 px-4 sm:px-6 lg:px-8"
      role="main"
      aria-label="Skills Matrix"
    >
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <motion.section
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <Zap className="w-4 h-4 text-primary" aria-hidden />
            <span className="text-sm font-medium text-primary">
              Professional Skills
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            Technical Skills Matrix
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive overview of expertise across multiple domains with
            proficiency levels, project experience, and professional
            certifications.
          </p>
        </motion.section>

        {/* Stats */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          aria-label="Skills Statistics"
        >
          <StatsCard
            label="Avg Proficiency"
            value={`${stats.avgLevel}%`}
            icon={TrendingUp}
          />
          <StatsCard
            label="Total Projects"
            value={stats.totalProjects}
            icon={Award}
          />
          <StatsCard
            label="Expert Skills"
            value={stats.expertSkills}
            icon={Zap}
          />
          <StatsCard
            label="Skills Displayed"
            value={stats.displayedSkills}
            icon={Filter}
          />
        </motion.section>

        {/* Filters + Skills */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-6"
          aria-labelledby="skills-controls-heading"
        >
          <header className="space-y-2" id="skills-controls-heading">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "w-12 h-12 rounded-lg bg-linear-to-br flex items-center justify-center shrink-0",
                  "bg-linear-to-r from-primary to-secondary"
                )}
              >
                <Filter className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  {selectedCategory === "all"
                    ? "All Skills"
                    : skillCategories.find((c) => c.id === selectedCategory)
                        ?.title ?? selectedCategory}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {selectedCategory === "all"
                    ? "Comprehensive view of all technical expertise across all domains"
                    : skillCategories.find((c) => c.id === selectedCategory)
                        ?.description ?? ""}
                </p>
              </div>
            </div>
          </header>

          <Controls
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            sortBy={sortBy}
            setSortBy={setSortBy}
            allSkillsWithCategory={allSkillsWithCategory}
            skillCategories={skillCategories}
            viewMode={viewMode}
            setViewMode={setViewMode}
          />

          <div
            className={cn(
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-6"
            )}
            role="list"
            aria-label="Skills list"
          >
            <AnimatePresence mode="popLayout">
              {filteredSkills.length > 0 ? (
                filteredSkills.map((skill, idx) =>
                  viewMode === "grid" ? (
                    <SkillCard
                      key={`${skill.name}-${idx}`}
                      skill={skill}
                      getProficiencyColor={getProficiencyColor}
                      getProficiencyLabel={getProficiencyLabel}
                      getCategoryColor={getCategoryColor}
                    />
                  ) : (
                    <SkillListRow
                      key={`${skill.name}-${idx}`}
                      skill={skill}
                      getProficiencyLabel={getProficiencyLabel}
                    />
                  )
                )
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full text-center py-12"
                  role="status"
                  aria-live="polite"
                >
                  <p className="text-muted-foreground">
                    No skills found matching your search. Try adjusting filters.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.section>

        {/* Footer Summary */}
        <motion.footer
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="border-t border-primary/20 pt-8 text-center"
        >
          <p className="text-sm text-muted-foreground" aria-label="Skills summary">
            Total Skills:{" "}
            <span className="font-bold text-foreground">
              {allSkillsWithCategory.length}
            </span>{" "}
            • Categories:{" "}
            <span className="font-bold text-foreground">
              {skillCategories.length}
            </span>{" "}
            • Showing:{" "}
            <span className="font-bold text-primary">
              {filteredSkills.length}
            </span>{" "}
            of {stats.totalSkills}
          </p>
        </motion.footer>
      </div>
    </div>
  );
}
