"use client";

import React, {
  useState,
  useMemo,
  useEffect,
  memo,
  useCallback,
} from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import {
  Github,
  Eye,
  BarChart3,
  Database,
  Code,
  Brain,
  TrendingUp,
  Zap,
  Target,
  LucideIcon,
  Search,
  Filter,
  Layers,
  Blocks,
  Grid3X3,
  List,
} from "lucide-react";
import Link from "next/link";
import { projects, Project } from "@/lib/types";
import { cn } from "@/lib/utils";

/* --------------------------------------------------------------
   Debounce
   -------------------------------------------------------------- */
function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

/* --------------------------------------------------------------
   Icon cache (tiny, fast)
   -------------------------------------------------------------- */
const iconMap: Record<string, LucideIcon> = {
  Database,
  Code,
  Brain,
  BarChart3,
  TrendingUp,
  Zap,
  Eye,
  Target,
} as const;

const getProjectIcon = (() => {
  const cache = new Map<string, LucideIcon>();
  return (iconName?: string): LucideIcon => {
    const key = iconName ?? "";
    if (cache.has(key)) return cache.get(key)!;
    const Icon = iconMap[iconName ?? ""] ?? BarChart3;
    cache.set(key, Icon);
    return Icon;
  };
})();

/* --------------------------------------------------------------
   PREMIUM ANIMATED BUTTON — FIXED ACTIVE STATES
   -------------------------------------------------------------- */
const AnimatedButton = memo(
  ({ children, className = "", ...props }: React.ComponentProps<typeof Button>) => (
    <motion.div
      whileHover={{ scale: 1.04, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
      className="w-full sm:w-auto"
    >
      <Button
        {...props}
        className={cn(
          "transition-all duration-300 inline-flex items-center justify-center gap-2 font-medium",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          className
        )}
      >
        {children}
      </Button>
    </motion.div>
  )
);
AnimatedButton.displayName = "AnimatedButton";

/* --------------------------------------------------------------
   StatsCard — FULLY PRESERVED
   -------------------------------------------------------------- */
const StatsCard = memo(
  ({
    label,
    value,
    icon: Icon,
    premium = false,
  }: {
    label: string;
    value: string | number;
    icon: React.ComponentType<{ className?: string }>;
    premium?: boolean;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 320, damping: 26 }}
      className="group relative"
      whileHover={{ y: -6 }}
      whileTap={{ y: -2 }}
    >
      <Card className={cn(
        "relative overflow-hidden glassmorphism rounded-xl p-6 transition-all duration-500 hover:shadow-2xl",
        "border border-border/40"
      )}>
        <motion.div
          className="absolute -inset-px rounded-xl bg-linear-to-r from-secondary/30 via-primary/20 to-secondary/30 opacity-0 blur-xl pointer-events-none"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />

        {premium && (
          <motion.div
            className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/80 to-transparent"
            initial={{ scaleX: 0 }}
            whileHover={{ scaleX: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          />
        )}

        <div className={cn(
          "absolute inset-0 rounded-xl pointer-events-none",
          "bg-linear-to-br from-primary/10 via-transparent to-primary/5 dark:from-primary/5"
        )} />

        <div className="relative flex items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground/80">
              {label}
            </p>
            <motion.p
              className={cn(
                "text-4xl font-bold tracking-tight text-foreground",
                premium && "bg-clip-text text-transparent bg-linear-to-r from-primary to-secondary dark:from-primary/80 dark:to-secondary/80"
              )}
              whileHover={{ scale: 1.06 }}
              transition={{ duration: 0.25 }}
            >
              {value}
            </motion.p>
          </div>

          <motion.div
            className="relative p-4 rounded-full bg-surface-level-1/70 backdrop-blur-md shadow-2xl shadow-black/20 ring-2 ring-primary/40 dark:ring-primary/30 group-hover:ring-secondary/60 transition duration-300"
            whileHover={{ scale: 1.25, rotate: 15 }}
            whileTap={{ scale: 1.15 }}
            transition={{ type: "spring", stiffness: 400, damping: 14 }}
          >
            <motion.div className="absolute inset-0 rounded-full bg-linear-to-br from-primary/40 to-secondary/30 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-600" />
            <Icon className="w-7 h-7 text-primary relative z-10" />
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-px bg-linear-to-r from-transparent via-secondary/70 to-transparent"
          whileHover={{ width: "80%" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        />
      </Card>
    </motion.div>
  )
);
StatsCard.displayName = "StatsCard";

/* --------------------------------------------------------------
   FeaturedProjectCard — ALL BUTTONS FIXED
   -------------------------------------------------------------- */
const FeaturedProjectCard = memo(
  ({ project, onPreviewClick }: { project: Project; onPreviewClick: (p: Project) => void }) => {
    const Icon = getProjectIcon(project.process[0]?.icon);

    return (
      <Card className={cn(
        "overflow-hidden",
        "border border-primary/20 bg-card/60 backdrop-blur-sm hover:bg-card/90",
        "transition-all duration-300 hover:shadow-xl"
      )}>
        <CardContent className="p-0">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="relative overflow-hidden">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-64 md:h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
              <Badge className={cn(
                "absolute top-4 left-4 text-xs font-semibold",
                "bg-linear-to-r from-primary to-secondary text-white"
              )}>
                {project.category}
              </Badge>
            </div>

            <div className="p-8">
              <div className="flex items-center mb-4">
                <Icon className="w-6 h-6 text-primary mr-2" />
                <span className="text-sm text-muted-foreground">Featured Project</span>
              </div>

              <CardTitle className="text-2xl mb-4">{project.title}</CardTitle>
              <CardDescription className="mb-6">{project.tagline}</CardDescription>

              <div className="grid grid-cols-2 gap-4 mb-6">
                {Object.entries(project.metrics).map(([k, v]) => (
                  <div key={k} className="text-center">
                    <div className="text-xl font-bold text-primary">{v}</div>
                    <div className="text-xs text-muted-foreground capitalize">
                      {k.replace(/([A-Z])/g, " $1")}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {project.technologies.map((t) => (
                  <Badge key={t} variant="outline">{t}</Badge>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                <AnimatedButton size="sm" variant="secondary" className="flex-1" onClick={() => onPreviewClick(project)}>
                  <Eye className="w-4 h-4 mr-2" /> Preview
                </AnimatedButton>
                <AnimatedButton size="sm" asChild>
                  <Link href={`/projects/${project.id}`}>
                    <Eye className="w-4 h-4 mr-2" /> Details
                  </Link>
                </AnimatedButton>
                <AnimatedButton variant="outline" size="sm" asChild className="btn-outline-premium">
                  <a href={project.links.github} target="_blank" rel="noopener noreferrer">
                    <Github className="w-3 h-3" /> Code
                  </a>
                </AnimatedButton>
                {project.links.dashboard && (
                  <AnimatedButton variant="outline" size="sm" asChild className="btn-outline-premium">
                    <Link href={project.links.dashboard}>
                      <BarChart3 className="w-3 h-3" /> Dashboard
                    </Link>
                  </AnimatedButton>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
);
FeaturedProjectCard.displayName = "FeaturedProjectCard";

/* --------------------------------------------------------------
   Controls — WITH GRID/LIST TOGGLE
   -------------------------------------------------------------- */
const Controls = memo(
  ({
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedDomain,
    setSelectedDomain,
    sortBy,
    setSortBy,
    availableCategories,
    availableDomains,
    totalCount,
    viewMode,
    setViewMode,
  }: {
    searchQuery: string;
    setSearchQuery: (q: string) => void;
    selectedCategory: string;
    setSelectedCategory: (c: string) => void;
    selectedDomain: string;
    setSelectedDomain: (d: string) => void;
    sortBy: "year" | "domain" | "title";
    setSortBy: (s: "year" | "domain" | "title") => void;
    availableCategories: string[];
    availableDomains: string[];
    totalCount: number;
    viewMode: "grid" | "list";
    setViewMode: (v: "grid" | "list") => void;
  }) => (
    <div className="flex flex-col lg:flex-row gap-4 items-end justify-between">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 flex-1">
        <div className="relative lg:col-span-1">
          <label htmlFor="search-input" className="sr-only">Search projects</label>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="search-input"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-muted/50 border-border/50"
          />
        </div>

        <div className="lg:col-span-1">
          <label htmlFor="category-select" className="sr-only">Filter by category</label>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger id="category-select" className="bg-muted/50 border-border/50">
              <Layers className="w-4 h-4 mr-2 text-primary" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-linear-to-br from-primary to-secondary rounded" />
                  All Categories ({totalCount})
                </div>
              </SelectItem>
              {availableCategories.map((cat) => {
                const cnt = projects.filter((p) => p.category === cat).length;
                return (
                  <SelectItem key={cat} value={cat}>
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-primary/70" />
                      {cat} ({cnt})
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        <div className="lg:col-span-1">
          <label htmlFor="domain-select" className="sr-only">Filter by domain</label>
          <Select value={selectedDomain} onValueChange={setSelectedDomain}>
            <SelectTrigger id="domain-select" className="bg-muted/50 border-border/50">
              <Filter className="w-4 h-4 mr-2 text-primary" />
              <SelectValue placeholder="Domain" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-linear-to-br from-primary to-secondary rounded" />
                  All Domains ({totalCount})
                </div>
              </SelectItem>
              {availableDomains.map((dom) => {
                const cnt = projects.filter((p) => p.domain === dom).length;
                return (
                  <SelectItem key={dom} value={dom}>
                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4 text-primary/70" />
                      {dom} ({cnt})
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        <div className="lg:col-span-1 flex gap-2" role="group" aria-label="Sort by">
          {(["year", "domain", "title"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSortBy(s)}
              className={cn(
                "flex-1 px-3 py-2 rounded-lg font-medium text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                sortBy === s
                  ? "bg-linear-to-r from-primary to-secondary text-white shadow-md"
                  : "bg-muted/80 backdrop-blur-sm text-primary border border-primary/30 hover:bg-primary/10"
              )}
              aria-pressed={sortBy === s}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* GRID / LIST TOGGLE */}
      <div className="flex bg-muted/50 rounded-lg p-1 shadow-inner">
        <button
          onClick={() => setViewMode("grid")}
          className={cn(
            "px-4 py-2 rounded-md flex items-center gap-2 transition-all",
            viewMode === "grid" ? "bg-background shadow-md text-primary" : "text-muted-foreground"
          )}
          aria-label="Grid view"
        >
          <Grid3X3 className="w-4 h-4" /> 
        </button>
        <button
          onClick={() => setViewMode("list")}
          className={cn(
            "px-4 py-2 rounded-md flex items-center gap-2 transition-all",
            viewMode === "list" ? "bg-background shadow-md text-primary" : "text-muted-foreground"
          )}
          aria-label="List view"
        >
          <List className="w-4 h-4" /> 
        </button>
      </div>
    </div>
  )
);
Controls.displayName = "Controls";

/* --------------------------------------------------------------
   ProjectCard — GRID + LIST VIEW + FIXED BUTTONS
   -------------------------------------------------------------- */
const ProjectCard = memo(
  ({
    project,
    onPreviewClick,
    viewMode,
  }: {
    project: Project;
    onPreviewClick: (p: Project) => void;
    viewMode: "grid" | "list";
  }) => {
    const Icon = getProjectIcon(project.process[0]?.icon);

    if (viewMode === "list") {
      return (
        <motion.div
          layout
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="group"
        >
          <Card className="hover:shadow-xl transition-all duration-300 border border-primary/20 bg-card/60 backdrop-blur-sm hover:bg-card/90">
            <div className="flex gap-6 p-6 items-start">
              <img
                src={project.image}
                alt={project.title}
                className="w-32 h-32 object-cover rounded-lg shadow-md"
                loading="lazy"
              />
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <Icon className="w-5 h-5 text-primary" />
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {project.title}
                  </CardTitle>
                  <Badge className="bg-linear-to-r from-primary to-secondary text-white text-xs">
                    {project.category}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">{project.domain}</Badge>
                </div>
                <CardDescription className="text-base">{project.description}</CardDescription>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.slice(0, 6).map((t) => (
                    <Badge key={t} variant="outline" className="text-xs">{t}</Badge>
                  ))}
                  {project.technologies.length > 6 && (
                    <Badge variant="outline" className="text-xs">+{project.technologies.length - 6}</Badge>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <AnimatedButton size="sm" variant="secondary" onClick={() => onPreviewClick(project)}>
                    <Eye className="w-4 h-4 mr-1" /> Preview
                  </AnimatedButton>
                  <AnimatedButton size="sm" asChild>
                    <Link href={`/projects/${project.id}`}>Details</Link>
                  </AnimatedButton>
                  <AnimatedButton variant="outline" size="sm" asChild className="btn-outline-premium">
                    <a href={project.links.github} target="_blank" rel="noopener noreferrer">
                      <Github className="w-4 h-4" />
                    </a>
                  </AnimatedButton>
                  {project.links.dashboard && (
                    <AnimatedButton variant="outline" size="sm" asChild className="btn-outline-premium">
                      <Link href={project.links.dashboard}>
                        <BarChart3 className="w-4 h-4" />
                      </Link>
                    </AnimatedButton>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      );
    }

    return (
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        whileHover={{ y: -4 }}
        className="group"
      >
        <Card className={cn(
          "h-full group hover:shadow-xl transition-all duration-300",
          "border border-primary/20",
          "bg-card/60 backdrop-blur-sm hover:bg-card/90",
          "overflow-hidden"
        )}>
          <CardHeader className="p-0 relative overflow-hidden">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
            <Badge className={cn(
              "absolute top-3 left-3 text-xs font-semibold",
              "bg-linear-to-r from-primary to-secondary text-white"
            )}>
              {project.category}
            </Badge>
            <Badge variant="secondary" className="absolute top-3 right-3 text-xs">
              {project.domain}
            </Badge>
          </CardHeader>

          <CardContent className="p-6 flex-1">
            <div className="flex items-center mb-2">
              <Icon className="w-4 h-4 text-primary mr-2" />
              <CardTitle className="text-lg group-hover:text-primary transition-colors">
                {project.title}
              </CardTitle>
            </div>
            <CardDescription className="mb-4 line-clamp-3">
              {project.description}
            </CardDescription>
            <div className="flex flex-wrap gap-1">
              {project.technologies.slice(0, 3).map((t) => (
                <Badge key={t} variant="outline" className="text-xs">{t}</Badge>
              ))}
              {project.technologies.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{project.technologies.length - 3}
                </Badge>
              )}
            </div>
          </CardContent>

          <CardFooter className="p-6 pt-0 flex gap-2 border-t">
            <AnimatedButton size="sm" variant="secondary" className="flex-1" onClick={() => onPreviewClick(project)}>
              <Eye className="w-3 h-3 mr-1" /> Preview
            </AnimatedButton>
            <AnimatedButton size="sm" asChild>
              <Link href={`/projects/${project.id}`}>Details</Link>
            </AnimatedButton>
            <AnimatedButton size="sm" variant="outline" asChild className="btn-outline-premium">
              <a href={project.links.github} target="_blank" rel="noopener noreferrer">
                <Github className="w-3 h-3" />
              </a>
            </AnimatedButton>
            {project.links.dashboard && (
              <AnimatedButton size="sm" variant="outline" asChild className="btn-outline-premium">
                <Link href={project.links.dashboard}>
                  <BarChart3 className="w-3 h-3" />
                </Link>
              </AnimatedButton>
            )}
          </CardFooter>
        </Card>
      </motion.div>
    );
  }
);
ProjectCard.displayName = "ProjectCard";

/* --------------------------------------------------------------
   ProjectPreviewContent & Dialog — FIXED BUTTONS
   -------------------------------------------------------------- */
const ProjectPreviewContent = memo(
  ({ project, onClose }: { project: Project; onClose: () => void }) => {
    const Icon = getProjectIcon(project.process[0]?.icon);
    const closeAndNavigate = useCallback(() => onClose(), [onClose]);

    return (
      <>
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Icon className="w-6 h-6 text-primary" />
            {project.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 overflow-y-auto max-h-[70vh] pr-2">
          <div className="relative rounded-xl overflow-hidden">
            <img src={project.image} alt={project.title} loading="lazy" className="w-full h-64 object-cover" />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
            <div className="absolute top-4 left-4 flex gap-2">
              <Badge className={cn("bg-linear-to-r from-primary to-secondary text-white")}>
                {project.category}
              </Badge>
              <Badge variant="secondary">{project.domain}</Badge>
            </div>
          </div>

          <section>
            <h3 className="mb-2 font-semibold text-lg">Overview</h3>
            <p className="text-muted-foreground">{project.fullDescription}</p>
          </section>

          <section>
            <h3 className="mb-2 font-semibold text-lg">Tech Stack</h3>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((t) => (
                <Badge key={t} variant="outline" className="bg-primary/5">{t}</Badge>
              ))}
            </div>
          </section>

          <section>
            <h3 className="mb-2 font-semibold text-lg">Key Metrics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(project.metrics).map(([k, v]) => (
                <div key={k} className="text-center p-3 bg-muted/50 rounded-lg flex flex-col items-center">
                  <span className="text-2xl font-bold text-primary">{v}</span>
                  <span className="text-xs text-muted-foreground capitalize">
                    {k.replace(/([A-Z])/g, " $1").trim()}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {project.process.length > 0 && (
            <section>
              <h3 className="mb-2 font-semibold text-lg">Process</h3>
              <div className="space-y-3">
                {project.process.map((s, i) => {
                  const StepIcon = getProjectIcon(s.icon);
                  return (
                    <div key={i} className="flex gap-3 items-start p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                      <StepIcon className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                      <div>
                        <p className="font-medium">{s.step}</p>
                        <p className="text-sm text-muted-foreground">{s.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          <div className="flex flex-wrap gap-3 pt-4 border-t">
            <AnimatedButton asChild className="flex-1">
              <Link href={`/projects/${project.id}`} onClick={closeAndNavigate}>
                <Eye className="w-4 h-4 mr-2" /> Full Details
              </Link>
            </AnimatedButton>
            <AnimatedButton variant="outline" asChild className="btn-outline-premium">
              <a href={project.links.github} target="_blank" rel="noopener noreferrer">
                <Github className="w-4 h-4 mr-2" /> GitHub
              </a>
            </AnimatedButton>
            {project.links.dashboard && (
              <AnimatedButton variant="outline" asChild className="btn-outline-premium">
                <Link href={project.links.dashboard} onClick={closeAndNavigate}>
                  <BarChart3 className="w-4 h-4 mr-2" /> Dashboard
                </Link>
              </AnimatedButton>
            )}
          </div>
        </div>
      </>
    );
  },
  (prev, next) => prev.project.id === next.project.id && prev.onClose === next.onClose
);
ProjectPreviewContent.displayName = "ProjectPreviewContent";

const ProjectPreviewDialog = memo(
  ({ project, onClose }: { project: Project | null; onClose: () => void }) => (
    <Dialog open={!!project} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden" onInteractOutside={(e) => e.preventDefault()}>
        <AnimatePresence mode="wait">
          {project && (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="p-6"
            >
              <ProjectPreviewContent project={project} onClose={onClose} />
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
);
ProjectPreviewDialog.displayName = "ProjectPreviewDialog";

/* --------------------------------------------------------------
   MAIN ProjectsGrid — FULL + GRID/LIST TOGGLE
   -------------------------------------------------------------- */
export function ProjectsGrid() {
  const [previewProject, setPreviewProject] = useState<Project | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDomain, setSelectedDomain] = useState("all");
  const [sortBy, setSortBy] = useState<"year" | "domain" | "title">("year");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const debouncedSearch = useDebounce(searchQuery, 300);

  const openPreview = useCallback((p: Project) => setPreviewProject(p), []);
  const closePreview = useCallback(() => setPreviewProject(null), []);

  const availableCategories = useMemo(() => Array.from(new Set(projects.map((p) => p.category))).sort(), []);
  const availableDomains = useMemo(() => Array.from(new Set(projects.map((p) => p.domain))).sort(), []);

  const uniqueTechCount = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => p.technologies.forEach((t) => set.add(t)));
    return set.size;
  }, []);

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
        case "year": return b.year - a.year;
        case "domain": return a.domain.localeCompare(b.domain);
        case "title": return a.title.localeCompare(b.title);
        default: return 0;
      }
    });
  }, [selectedCategory, selectedDomain, debouncedSearch, sortBy]);

  const featuredProject = projects.find((p) => p.id === "strategic-merger-ott");
  const totalCount = projects.length;

  const stats = useMemo(() => {
    const avgYear = filteredProjects.length > 0
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
  }, [featuredProject?.image]);

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8" role="main" aria-label="Projects Portfolio">
      <div className="max-w-7xl mx-auto space-y-12">
        <motion.section initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }} className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Project Portfolio</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">Projects Showcase</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore real-world solutions across domains with live demos, code, and performance metrics.
          </p>
        </motion.section>

        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Projects", value: projects.length, icon: Blocks },
            { label: "Categories", value: availableCategories.length, icon: Layers },
            { label: "Technologies", value: uniqueTechCount, icon: Code },
            { label: "Displayed", value: stats.displayed, icon: Filter },
          ].map((s) => (
            <StatsCard key={s.label} {...s} />
          ))}
        </motion.section>

        {featuredProject && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Featured Project</h2>
            <FeaturedProjectCard project={featuredProject} onPreviewClick={openPreview} />
          </section>
        )}

        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="space-y-6">
          <header className="flex justify-between items-center flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-linear-to-br from-primary to-secondary flex items-center justify-center">
                <Filter className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">All Projects</h2>
                <p className="text-sm text-muted-foreground">Filter and explore the full portfolio</p>
              </div>
            </div>
          </header>

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
            totalCount={totalCount}
            viewMode={viewMode}
            setViewMode={setViewMode}
          />

          <div className={cn(
            "gap-6",
            viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "space-y-6"
          )} role="list">
            <AnimatePresence mode="popLayout">
              {filteredProjects.length > 0 ? (
                filteredProjects.map((p) => (
                  <ProjectCard key={p.id} project={p} onPreviewClick={openPreview} viewMode={viewMode} />
                ))
              ) : (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full text-center py-12 text-muted-foreground"
                  role="status"
                  aria-live="polite"
                >
                  No projects match your filters. Try adjusting your search.
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </motion.section>

        <motion.footer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="border-t border-primary/20 pt-8 text-center"
        >
          <p className="text-sm text-muted-foreground">
            Total: <span className="font-bold text-foreground">{projects.length}</span> •
            Showing: <span className="font-bold text-primary">{filteredProjects.length}</span>
          </p>
        </motion.footer>
      </div>

      <ProjectPreviewDialog project={previewProject} onClose={closePreview} />
    </div>
  );
}