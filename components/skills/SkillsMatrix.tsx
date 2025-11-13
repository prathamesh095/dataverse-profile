// components/skills/SkillsMatrix.tsx
"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import { motion, AnimatePresence, easeOut, easeIn } from "framer-motion";
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

/* ---------------------------------------------------
   Extended Skill Type
--------------------------------------------------- */
type ExtendedSkill = Skill & {
  category: string;
  consistency?: number;
  usage?: "High" | "Medium" | "Low";
  confidence?: "Strong" | "Medium" | "Basic";
};

/* ---------------------------------------------------
   Animation Variants (Type-Safe with Framer Motion v10+)
--------------------------------------------------- */
const itemVariants = {
  initial: { opacity: 0, y: 18 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: easeOut },
  },
  exit: {
    opacity: 0,
    y: -12,
    transition: { duration: 0.25, ease: easeIn },
  },
};

const headerVariants = {
  initial: { opacity: 0, y: -20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: easeOut },
  },
};

/* ---------------------------------------------------
   Component: SkillsMatrix
--------------------------------------------------- */
export function SkillsMatrix() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"level" | "consistency" | "confidence" | "usage">("level");
  const [maxSkills, setMaxSkills] = useState(12);
  const [viewMode, setViewMode] = useLocalStorage<"grid" | "list">(
    "skills:viewMode",
    "grid"
  );

  const debouncedSearch = useDebounce(searchQuery, 250);

  const skillCategories: SkillCategory[] =
    typeof window !== "undefined"
      ? require("@/lib/skills").skillCategories
      : _skillCategories;

  /* ---------------------------------------------------
     Merge categories -> skills
  --------------------------------------------------- */
  const allSkillsWithCategory = useMemo(() => {
    return skillCategories.flatMap((cat) =>
      cat.skills.map(
        (s) =>
          ({
            ...s,
            category: cat.id,
            consistency: (s as any).consistency ?? 3,
            usage: (s as any).usage ?? "Medium",
            confidence: (s as any).confidence ?? "Medium",
          } as ExtendedSkill)
      )
    );
  }, [skillCategories]);

  if (!allSkillsWithCategory.length)
    return (
      <div className="py-20 text-center text-muted-foreground">
        No skills found.
      </div>
    );

  /* ---------------------------------------------------
     Fuse Search Setup
  --------------------------------------------------- */
  const fuseDocs = useMemo(
    () =>
      allSkillsWithCategory.map((s) => ({
        title: s.name,
        keywords: [],
        ref: s,
      })),
    [allSkillsWithCategory]
  );

  const { search: fuseSearch } = useFuseSearch(fuseDocs, {
    keys: ["title"],
    threshold: 0.32,
  });

  /* ---------------------------------------------------
     Stats-filtered list
  --------------------------------------------------- */
  const filteredForStats = useMemo(() => {
    let base =
      selectedCategory === "all"
        ? allSkillsWithCategory
        : allSkillsWithCategory.filter((s) => s.category === selectedCategory);

    if (!debouncedSearch) return base;

    const matches = fuseSearch(debouncedSearch).map((r: any) => r.ref.name);
    return base.filter((s) => matches.includes(s.name));
  }, [selectedCategory, debouncedSearch, fuseSearch, allSkillsWithCategory]);

  /* ---------------------------------------------------
     Stats
  --------------------------------------------------- */
  const stats = useMemo(() => {
    const list = filteredForStats;

    const avgLevel = list.length
      ? Math.round(list.reduce((a, b) => a + b.level, 0) / list.length)
      : 0;

    const avgConsistency = list.length
      ? (
          list.reduce((a, b) => a + (b.consistency ?? 0), 0) / list.length
        ).toFixed(2)
      : "0";

    const strongConfidence = list.filter((s) => s.confidence === "Strong").length;

    const total =
      selectedCategory === "all"
        ? allSkillsWithCategory.length
        : allSkillsWithCategory.filter((s) => s.category === selectedCategory).length;

    return {
      avgLevel,
      avgConsistency,
      strongConfidence,
      totalSkills: total,
      displayedSkills: list.length,
    };
  }, [filteredForStats, selectedCategory, allSkillsWithCategory]);

  /* ---------------------------------------------------
     Final filtered + sorted results
  --------------------------------------------------- */
  const filteredSkills = useMemo(() => {
    let list =
      selectedCategory === "all"
        ? [...allSkillsWithCategory]
        : allSkillsWithCategory.filter((s) => s.category === selectedCategory);

    if (debouncedSearch) {
      const matches = fuseSearch(debouncedSearch).map((r: any) => r.ref.name);
      list = list.filter((s) => matches.includes(s.name));
    }

    list.sort((a, b) => {
      if (sortBy === "level") return b.level - a.level;
      if (sortBy === "consistency")
        return (b.consistency ?? 0) - (a.consistency ?? 0);

      if (sortBy === "confidence") {
        const rank = (v: string | undefined) =>
          v === "Strong" ? 3 : v === "Medium" ? 2 : 1;
        return rank(b.confidence) - rank(a.confidence);
      }

      if (sortBy === "usage") {
        const ur = (v: string | undefined) =>
          v === "High" ? 3 : v === "Medium" ? 2 : 1;
        return ur(b.usage) - ur(a.usage);
      }

      return 0;
    });

    return list.slice(0, maxSkills);
  }, [
    allSkillsWithCategory,
    selectedCategory,
    debouncedSearch,
    fuseSearch,
    sortBy,
    maxSkills,
  ]);

  /* ---------------------------------------------------
     Responsive max-skill count
  --------------------------------------------------- */
  useEffect(() => {
    const ro = new ResizeObserver((entries) => {
      const w = entries[0].contentRect.width;
      setMaxSkills(w >= 1300 ? 12 : w >= 1000 ? 9 : w >= 700 ? 6 : 4);
    });

    ro.observe(document.body);
    return () => ro.disconnect();
  }, []);

  /* ---------------------------------------------------
     Helpers
  --------------------------------------------------- */
  const getProficiencyColor = useCallback((level: number) => {
    if (level >= 90) return "bg-gradient-to-r from-primary to-secondary";
    if (level >= 80) return "bg-gradient-to-r from-status-info to-secondary";
    if (level >= 70) return "bg-gradient-to-r from-secondary to-tertiary";
    return "bg-gradient-to-r from-tertiary to-status-warning";
  }, []);

  const getProficiencyLabel = useCallback((level: number) => {
    if (level >= 90) return "Expert";
    if (level >= 80) return "Advanced";
    if (level >= 70) return "Intermediate";
    return "Beginner";
  }, []);

  /* ---------------------------------------------------
     RENDER
  --------------------------------------------------- */
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">

        {/* HEADER */}
        <motion.header
          variants={headerVariants}
          initial="initial"
          animate="animate"
          className="space-y-4 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mx-auto">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Professional Skills
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            Technical Skills Matrix
          </h1>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Strength dashboard focused on consistency, usage, and confidence — project-free.
          </p>

          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground mt-2">
            <span>
              Total skills{" "}
              <span className="font-semibold text-foreground">
                {allSkillsWithCategory.length}
              </span>
            </span>

            <div className="w-px h-4 bg-border" />

            <span>
              Showing{" "}
              <span className="font-semibold text-primary">
                {filteredSkills.length}
              </span>
            </span>
          </div>
        </motion.header>

        {/* STATS */}
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard label="Avg Proficiency" value={`${stats.avgLevel}%`} icon={TrendingUp} />
            <StatsCard label="Avg Consistency" value={stats.avgConsistency} icon={Zap} />
            <StatsCard label="Strong Confidence" value={stats.strongConfidence.toString()} icon={Award} />
            <StatsCard label="Skills Displayed" value={stats.displayedSkills.toString()} icon={Filter} />
          </div>
        </section>

        {/* CONTROLS */}
        <Controls
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          sortBy={sortBy}
          setSortBy={setSortBy}
          viewMode={viewMode}
          setViewMode={setViewMode}
          allSkillsWithCategory={allSkillsWithCategory}
          skillCategories={skillCategories}
        />

        {/* EMPTY STATE */}
        {filteredSkills.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-8 text-center text-muted-foreground border border-primary/10 bg-muted/40 p-8 rounded-lg"
          >
            <p className="text-lg">No skills found. Try adjusting your filters.</p>
          </motion.div>
        )}

        {/* GRID / LIST VIEW */}
        <AnimatePresence mode="popLayout">
          {viewMode === "grid" ? (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredSkills.map((skill, index) => (
                <motion.div
                  key={`${skill.name}-${skill.category}-${index}`}
                  layout
                  variants={itemVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="h-full"
                >
                  <SkillCard
                    skill={skill}
                    getProficiencyColor={getProficiencyColor}
                    getProficiencyLabel={getProficiencyLabel}
                    getCategoryColor={() => "text-primary"}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div layout className="space-y-4">
              {filteredSkills.map((skill, index) => (
                <motion.div
                  key={`${skill.name}-${skill.category}-${index}`}
                  layout
                  variants={itemVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <SkillListRow
                    skill={skill}
                    getProficiencyLabel={getProficiencyLabel}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* FOOTER */}
        <footer className="border-t pt-8 text-center border-primary/10">
          <p className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-bold text-primary">{filteredSkills.length}</span>{" "}
            of{" "}
            <span className="font-bold text-foreground">
              {stats.totalSkills}
            </span>{" "}
            Skills
          </p>
        </footer>
      </div>
    </div>
  );
}