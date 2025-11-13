"use client";

import dynamic from "next/dynamic";
import { useState, useMemo, useRef, useEffect, Suspense } from "react";
import { motion, AnimatePresence, Variants, LazyMotion, domAnimation } from "framer-motion";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
  Loader2,
  Target,
  Code,
  Zap,
  BarChart3,
  Eye,
  Lightbulb,
  TrendingUp,
  Award,
  Github,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Project } from "@/lib/types";
import { ScrollProgress } from "./components/ScrollProgress";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { AnimatedButton } from "@/components/projects/internal/AnimatedButtonShim";

const HeroSection = dynamic(() => import("./sections/HeroSection"), { ssr: false });
const OverviewSection = dynamic(() => import("./sections/OverviewSection"), { ssr: false });
const TechStackSection = dynamic(() => import("./sections/TechStackSection"), { ssr: false });
const FeaturesSection = dynamic(() => import("./sections/FeaturesSection"), { ssr: false });
const ProcessSection = dynamic(() => import("./sections/ProcessSection"), { ssr: false });
const GallerySection = dynamic(() => import("./sections/GallerySection"), { ssr: false });
const LearningsSection = dynamic(() => import("./sections/LearningsSection"), { ssr: false });
const AchievementsSection = dynamic(() => import("./sections/AchievementsSection"), { ssr: false });
const StatsSection = dynamic(() => import("./sections/StatsSection"), { ssr: false });
const RelatedProjects = dynamic(() => import("./sections/RelatedProjects"), { ssr: false });

function SkeletonSection() {
  return (
    <div className="py-16 flex flex-col items-center justify-center text-muted-foreground">
      <Loader2 className="w-6 h-6 animate-spin mb-2" />
      <span className="text-sm">Loading section...</span>
    </div>
  );
}

const fadeSlideVariant: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: ["easeOut"] } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.25, ease: ["easeIn"] } },
};

export default function ProjectDetails({ project }: { project: Project }) {
  const [activeValue, setActiveValue] = useState("overview");
  const tabsListRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);

  if (!project) {
    return <div className="p-10 text-center text-muted-foreground text-lg">Project not found.</div>;
  }

  const { achievements = [], links = {} as { github?: string; report?: string; dashboard?: string } } = project;
  const { github, report, dashboard } = links;

  const tabs = useMemo(
    () => [
      { value: "overview", label: "Overview", icon: Target },
      { value: "tech-stack", label: "Tech Stack", icon: Code },
      { value: "features", label: "Features", icon: Zap },
      { value: "process", label: "Process", icon: BarChart3 },
      { value: "gallery", label: "Gallery", icon: Eye },
      { value: "learnings", label: "Learnings", icon: Lightbulb },
      { value: "stats", label: "Stats", icon: TrendingUp },
      ...(achievements.length ? [{ value: "achievements", label: "Achievements", icon: Award }] : []),
    ],
    [achievements.length]
  );

  useEffect(() => {
    if (!tabsListRef.current) return;
    const container = tabsListRef.current;
    const activeEl = container.querySelector(`[data-state=active]`) as HTMLElement | null;
    if (!activeEl) return;

    const scrollLeft = activeEl.offsetLeft - container.clientWidth / 2 + activeEl.offsetWidth / 2;
    container.scrollTo({ left: scrollLeft, behavior: "smooth" });

    if (indicatorRef.current) {
      indicatorRef.current.style.transform = `translateX(${activeEl.offsetLeft}px)`;
      indicatorRef.current.style.width = `${activeEl.offsetWidth}px`;
    }
  }, [activeValue]);

  const sectionsMap: Record<string, JSX.Element | null> = {
    overview: <OverviewSection project={project} />,
    "tech-stack": <TechStackSection project={project} />,
    features: <FeaturesSection project={project} />,
    process: <ProcessSection project={project} />,
    gallery: <GallerySection project={project} />,
    learnings: <LearningsSection project={project} />,
    stats: <StatsSection project={project} />,
    achievements: achievements.length ? <AchievementsSection project={project} /> : null,
  };

  return (
    <LazyMotion features={domAnimation}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
        <ScrollProgress />
        <Navigation />

        <main className="pt-0 sm:pt-2">
          {/* Hero Section Animation */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <Suspense fallback={<SkeletonSection />}>
              <HeroSection project={project} />
            </Suspense>
          </motion.div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
            {/* Tabs Animation */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <Tabs value={activeValue} onValueChange={setActiveValue} className="space-y-10">
                <div className="relative">
                  <TabsList
                    ref={tabsListRef}
                    className={cn(
                      "inline-flex h-auto min-h-12 w-full flex-nowrap overflow-x-auto rounded-xl p-1 gap-1.5 scrollbar-hide",
                      "bg-linear-to-r from-muted/40 to-muted/60 border border-border/40 shadow-inner backdrop-blur-md",
                      "md:justify-center md:flex-wrap md:overflow-visible"
                    )}
                    role="tablist"
                  >
                    {tabs.map(({ value, label, icon: Icon }) => (
                      <TabsTrigger
                        key={value}
                        value={value}
                        className={cn(
                          "group relative shrink-0 flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-xs sm:text-sm font-medium transition-all",
                          "text-muted-foreground hover:text-foreground hover:bg-primary/5",
                          "data-[state=active]:bg-linear-to-r data-[state=active]:from-primary data-[state=active]:to-fuchsia-500",
                          "data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-[1.05]"
                        )}
                      >
                        <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-data-[state=active]:scale-110" />
                        <span className="hidden sm:inline">{label}</span>
                        <span className="sm:hidden">{label.split(" ")[0]}</span>
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  <div className="sm:hidden absolute bottom-0 left-0 w-full h-0.5 pointer-events-none">
                    <motion.div
                      ref={indicatorRef}
                      className="h-0.5 rounded-full bg-linear-to-r from-primary via-fuchsia-500 to-purple-500"
                      layout
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  </div>
                </div>

                <div className="relative min-h-[300px] mt-6">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeValue}
                      variants={fadeSlideVariant}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                    >
                      <Suspense fallback={<SkeletonSection />}>
                        {sectionsMap[activeValue] ?? (
                          <div className="p-10 text-center text-muted-foreground">No content available.</div>
                        )}
                      </Suspense>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </Tabs>
            </motion.div>

            {/* Buttons Animation */}
            <motion.div
              className="flex flex-wrap gap-4 mt-14 mb-14 justify-center"
              initial="hidden"
              whileInView="visible"
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { staggerChildren: 0.15, duration: 0.6, ease: "easeOut" },
                },
              }}
              viewport={{ once: true }}
            >
              {[github, report, dashboard].map(
                (link, i) =>
                  link && (
                    <motion.div
                      key={i}
                      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                    >
                      {i === 0 && (
                        <AnimatedButton size="lg" className="btn-outline-premium">
                          <a href={link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                            <Github className="w-5 h-5" /> Source Code
                          </a>
                        </AnimatedButton>
                      )}
                      {i === 1 && (
                        <AnimatedButton size="lg" className="btn-outline-premium">
                          <a href={link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                            <FileText className="w-5 h-5" /> Project Report
                          </a>
                        </AnimatedButton>
                      )}
                      {i === 2 && (
                        <AnimatedButton size="lg" className="btn-filled-premium">
                          <Link href={link} className="flex items-center gap-2">
                            <BarChart3 className="w-5 h-5" /> Dashboard
                          </Link>
                        </AnimatedButton>
                      )}
                    </motion.div>
                  )
              )}
            </motion.div>

            {/* Related Projects Animation */}
            <motion.div
              className="border-primary/20 backdrop-blur-sm bg-card/60 shadow-lg hover:shadow-xl transition-all rounded-2xl"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <CardContent className="p-8 md:p-10 space-y-6 text-center">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Explore More Projects</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Dive deeper into similar projects and explore more creative case studies showcasing skills, design, and development craft.
                </p>

                <div className="mt-8">
                  <Suspense fallback={<SkeletonSection />}>
                    <RelatedProjects current={project} />
                  </Suspense>
                </div>

                <div className="pt-6">
                  <AnimatedButton size="lg" className="btn-outline-premium inline-flex mx-auto">
                    <Link href="/projects" className="flex items-center gap-2">View all projects →</Link>
                  </AnimatedButton>
                </div>
              </CardContent>
            </motion.div>
          </div>
        </main>

        <Footer />
      </motion.div>
    </LazyMotion>
  );
}