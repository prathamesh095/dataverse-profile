"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { projects, Project } from "@/lib/types";
import { cn } from "@/lib/utils";

/* Modular imports */
import { Controls } from "./controls/Controls";
import { useDebounce } from "./controls/useDebounce";
import { StatsCard } from "./cards/StatsCard";
import { FeaturedProjectCard } from "./cards/FeaturedProjectCard";
import { ProjectCard } from "./cards/ProjectCard";
import { ProjectPreviewDialog } from "./preview/ProjectPreviewDialog";

/* Icons */
import { Blocks, Layers, Code, Filter, Zap } from "lucide-react";

/**
 * ProjectsGrid — Main Orchestrator
 * -------------------------------------------------------------------
 * Handles:
 *   - Search, Filter, and Sort logic
 *   - Featured Project showcase
 *   - Animated Grid/List rendering
 *   - Project preview modal
 *   - Navigation to /projects/[id]
 * -------------------------------------------------------------------
 */
export function ProjectsGrid(): JSX.Element {
  const [previewProject, setPreviewProject] = useState<Project | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDomain, setSelectedDomain] = useState("all");
  const [sortBy, setSortBy] = useState<"year" | "domain" | "title">("year");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const debouncedSearch = useDebounce(searchQuery, 300);

  const openPreview = useCallback((p: Project) => setPreviewProject(p), []);
  const closePreview = useCallback(() => setPreviewProject(null), []);

  /* ===============================================
     CATEGORIES / DOMAINS / TECH COUNTS
  =============================================== */
  const availableCategories = useMemo(
    () => Array.from(new Set(projects.map((p) => p.category))).sort(),
    []
  );

  const availableDomains = useMemo(
    () => Array.from(new Set(projects.map((p) => p.domain))).sort(),
    []
  );

  const uniqueTechCount = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => p.technologies.forEach((t) => set.add(t)));
    return set.size;
  }, []);

  /* ===============================================
     FILTERING + SORTING
  =============================================== */
  const filteredProjects = useMemo(() => {
    let list = projects;

    if (selectedCategory !== "all") list = list.filter((p) => p.category === selectedCategory);
    if (selectedDomain !== "all") list = list.filter((p) => p.domain === selectedDomain);

    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.technologies.some((t) => t.toLowerCase().includes(q)) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    return [...list].sort((a, b) => {
      switch (sortBy) {
        case "year":
          return b.year - a.year;
        case "domain":
          return a.domain.localeCompare(b.domain);
        case "title":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });
  }, [selectedCategory, selectedDomain, debouncedSearch, sortBy]);

  /* ===============================================
     FEATURED PROJECT + STATS
  =============================================== */
  const featuredProject = useMemo(
    () => projects.find((p) => p.id === "strategic-merger-ott") ?? projects[0],
    []
  );

  const stats = useMemo(() => {
    const avgYear =
      filteredProjects.length > 0
        ? Math.round(filteredProjects.reduce((s, p) => s + p.year, 0) / filteredProjects.length)
        : 0;
    const techs = new Set(filteredProjects.flatMap((p) => p.technologies)).size;
    return { avgYear, techs, displayed: filteredProjects.length };
  }, [filteredProjects]);

  useEffect(() => {
    if (featuredProject?.image) {
      const img = new Image();
      img.src = featuredProject.image;
    }
  }, [featuredProject]);

  /* ===============================================
     RENDER
  =============================================== */
  return (
    <div
      className="min-h-screen py-12 px-4 sm:px-6 lg:px-8"
      role="main"
      aria-label="Projects Portfolio"
    >
      <div className="max-w-7xl mx-auto space-y-12">
        {/* ===== Header ===== */}
        <motion.section
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Project Portfolio</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            Projects Showcase
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore practical data science and machine learning projects with code,
            dashboards, and live results.
          </p>
        </motion.section>

        {/* ===== Stats Section ===== */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {[
            { label: "Total Projects", value: projects.length, icon: Blocks },
            { label: "Categories", value: availableCategories.length, icon: Layers },
            { label: "Technologies", value: uniqueTechCount, icon: Code },
            { label: "Visible", value: stats.displayed, icon: Filter },
          ].map((s) => (
            <StatsCard key={s.label} label={s.label} value={s.value} icon={s.icon} />
          ))}
        </motion.section>

        {/* ===== Featured Project ===== */}
        {featuredProject && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Featured Project</h2>
            <FeaturedProjectCard project={featuredProject} onPreviewClick={openPreview} />
          </section>
        )}

        {/* ===== All Projects ===== */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-6"
        >
          <header className="flex justify-between items-center flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-linear-to-br from-primary to-accent flex items-center justify-center">
                <Filter className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">All Projects</h2>
                <p className="text-sm text-muted-foreground">
                  Filter, search, and explore all case studies.
                </p>
              </div>
            </div>
          </header>

          {/* ===== Controls ===== */}
          <Controls
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedDomain={selectedDomain}
            setSelectedDomain={setSelectedDomain}
            sortBy={sortBy}
            setSortBy={setSortBy}
            availableCategories={availableCategories}
            availableDomains={availableDomains}
            totalCount={projects.length}
            viewMode={viewMode}
            setViewMode={setViewMode}
          />

          {/* ===== Grid/List Rendering ===== */}
          <div
            className={cn(
              "gap-6",
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                : "space-y-6"
            )}
            role="list"
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects.length > 0 ? (
                filteredProjects.map((p) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* ✅ ProjectCard handles its own internal Link now */}
                    <ProjectCard
                      project={p}
                      viewMode={viewMode}
                      onPreviewClick={openPreview}
                    />
                  </motion.div>
                ))
              ) : (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full text-center py-12 text-muted-foreground"
                  role="status"
                  aria-live="polite"
                >
                  No projects found. Try adjusting your filters.
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </motion.section>

        {/* ===== Footer Summary ===== */}
        <motion.footer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="border-t border-primary/20 pt-8 text-center"
        >
          <p className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-semibold text-primary">{filteredProjects.length}</span> of{" "}
            <span className="font-semibold text-foreground">{projects.length}</span> total
            projects.
          </p>
        </motion.footer>
      </div>

      {/* ===== Project Preview Modal ===== */}
      <ProjectPreviewDialog project={previewProject} onClose={closePreview} />
    </div>
  );
}

export default ProjectsGrid;
