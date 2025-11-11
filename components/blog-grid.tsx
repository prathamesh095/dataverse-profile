"use client";

import React, {
  useState,
  useMemo,
  useEffect,
  useRef,
  memo,
  useCallback,
  ForwardedRef,
  forwardRef,
} from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  ArrowRight,
  Search,
  Layers,
  Tag,
  Filter,
  LucideIcon,
  Code,
  Brain,
  TrendingUp,
  Database,
  Star,
  BarChart3,
  List as ListIcon,
  Grid3X3,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { blogPosts, type BlogPost } from "@/lib/blogs";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";

/* ------------------- Input ------------------- */
type InputProps = React.InputHTMLAttributes<HTMLInputElement>;
const Input = forwardRef<HTMLInputElement, InputProps>(
  (props, ref: ForwardedRef<HTMLInputElement>) => (
    <input
      ref={ref}
      {...props}
      className={cn(
        "border rounded-md px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary/50",
        props.className
      )}
    />
  )
);
Input.displayName = "Input";

/* ------------------- Hooks ------------------- */
function useDebounce<T>(value: T, delay: number) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

function useLocalStorage<T>(key: string, initial: T) {
  const [state, setState] = useState<T>(() => {
    if (typeof window === "undefined") return initial;
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch {}
  }, [key, state]);
  return [state, setState] as const;
}

/* ------------------- Category Icons ------------------- */
const categoryIconMap: Record<string, LucideIcon> = {
  all: Filter,
  "data-analytics": BarChart3,
  "machine-learning": Brain,
  "data-engineering": Database,
  cloud: Code,
  "data-visualization": BarChart3,
  sql: Database,
  python: Code,
  tutorials: TrendingUp,
  "case-studies": Star,
};

/* ------------------- Utility UI ------------------- */
const EmptyState = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <div className="text-center py-16 border rounded-2xl bg-card/50 border-dashed border-border">
    <div className="mx-auto mb-3 w-12 h-12 rounded-full grid place-items-center bg-primary/10">
      <Search className="w-6 h-6 text-primary" />
    </div>
    <h3 className="text-lg font-semibold">{title}</h3>
    <p className="text-muted-foreground mt-1">{subtitle}</p>
  </div>
);

/* ------------------- Animated Button ------------------- */
const AnimatedButton = memo(
  ({ children, className = "", ...props }: React.ComponentProps<typeof Button>) => (
    <motion.div
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Button
        {...props}
        className={cn(
          "transition-all duration-300 font-medium",
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

/* ------------------- Post Card ------------------- */
const PostCard = memo(function PostCard({ post, onPreview }: { post: BlogPost; onPreview: () => void }) {
  const isExternal = !!post.link;
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="h-full border border-border/70 bg-card/70 backdrop-blur-sm flex flex-col hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold leading-snug line-clamp-2 text-foreground group-hover:text-primary transition-colors">
            {post.title}
          </CardTitle>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="border-border/70">
              <Tag className="w-3 h-3 mr-1" /> {post.category.replace(/-/g, " ")}
            </Badge>
            <span className="text-xs text-muted-foreground flex items-center gap-1 ml-auto">
              <Calendar className="w-3 h-3" />
              {new Date(post.publishDate).toLocaleDateString()}
            </span>
          </div>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p className="line-clamp-3">{post.excerpt}</p>
          <div className="mt-3 flex flex-wrap gap-1">
            {post.tags.slice(0, 3).map((t) => (
              <Badge key={t} variant="secondary" className="text-xs">
                {t}
              </Badge>
            ))}
          </div>
        </CardContent>
        <CardFooter className="pt-4 mt-auto flex justify-between">
          <AnimatedButton size="sm" variant="outline" onClick={onPreview} className="btn-outline-premium">
            Quick View
          </AnimatedButton>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                {isExternal ? (
                  <AnimatedButton asChild size="sm" className="btn-filled-premium">
                    <Link href={post.link!} target="_blank" rel="noopener noreferrer">
                      Read <ExternalLink className="w-4 h-4 ml-1" />
                    </Link>
                  </AnimatedButton>
                ) : (
                  <Button size="sm" disabled variant="secondary" className="opacity-60 cursor-not-allowed">
                    Read
                  </Button>
                )}
              </TooltipTrigger>
              {!isExternal && (
                <TooltipContent>
                  <p>No external link available</p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </CardFooter>
      </Card>
    </motion.div>
  );
});

/* ------------------- Blog Preview Modal ------------------- */
const BlogPreviewModal = memo(function BlogPreviewModal({ post, onClose }: { post: BlogPost | null; onClose: () => void }) {
  if (!post) return null;
  return (
    <Dialog open={!!post} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden">
        <div className="px-6 pt-6 pb-4 border-b bg-card/80 backdrop-blur-sm">
          <DialogHeader className="space-y-2">
            <Badge className="bg-primary text-primary-foreground">Preview</Badge>
            <DialogTitle className="text-2xl font-semibold leading-snug">{post.title}</DialogTitle>
            <p className="text-sm text-muted-foreground line-clamp-3">{post.excerpt}</p>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(post.publishDate).toLocaleDateString()}
              </span>
            </div>
          </DialogHeader>
        </div>

        <div className="px-6 py-6 space-y-6">
          <div className="flex flex-wrap gap-2">
            <Badge>{post.category.replace(/-/g, " ")}</Badge>
            {post.tags.map((t) => (
              <Badge key={t} variant="secondary">
                {t}
              </Badge>
            ))}
          </div>
          <div className="rounded-lg border p-4 bg-muted/30">
            <p className="text-sm leading-relaxed text-muted-foreground">
              {(post.content && post.content.slice(0, 600)) || post.excerpt}...
            </p>
          </div>

          {post.link && (
            <AnimatedButton asChild className="w-full btn-filled-premium">
              <Link href={post.link} target="_blank" rel="noopener noreferrer">
                Read Full Article <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </AnimatedButton>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
});

/* ------------------- Main ------------------- */
export function BlogGrid() {
  const [previewPost, setPreviewPost] = useState<BlogPost | null>(null);
  const [search, setSearch] = useLocalStorage("blog:search", "");
  const [category, setCategory] = useLocalStorage("blog:category", "all");
  const [tag, setTag] = useLocalStorage("blog:tag", "all");
  const [sortBy, setSortBy] = useLocalStorage<"date" | "views" | "likes">("blog:sort", "date");
  const [view, setView] = useLocalStorage<"grid" | "list">("blog:view", "grid");
  const [visibleCount, setVisibleCount] = useState(9);

  const debouncedSearch = useDebounce(search, 250);
  const openPreview = useCallback((p: BlogPost) => setPreviewPost(p), []);
  const closePreview = useCallback(() => setPreviewPost(null), []);

  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setVisibleCount((v) => v + 9)),
      { rootMargin: "200px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => setVisibleCount(9), [category, tag, debouncedSearch, sortBy, view]);

  const categories = useMemo(
    () => Array.from(new Set(blogPosts.map((p) => p.category))).sort(),
    []
  );

  const tags = useMemo(() => {
    const set = new Set<string>();
    blogPosts.forEach((p) => p.tags.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, []);

  const filteredPosts = useMemo(() => {
    let list = blogPosts.slice();
    if (category !== "all") list = list.filter((p) => p.category === category);
    if (tag !== "all") list = list.filter((p) => p.tags.includes(tag));
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return list.sort(
      (a, b) =>
        new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
    );
  }, [category, tag, debouncedSearch, sortBy]);

  const featuredPost = useMemo(
    () => filteredPosts.find((p) => p.featured) || blogPosts.find((p) => p.featured) || null,
    [filteredPosts]
  );

  const nonFeatured = useMemo(
    () => filteredPosts.filter((p) => p.id !== featuredPost?.id),
    [filteredPosts, featuredPost]
  );

  const displayed = useMemo(
    () => nonFeatured.slice(0, visibleCount),
    [nonFeatured, visibleCount]
  );

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        <motion.section
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center space-y-3"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border bg-linear-to-r from-primary/10 to-secondary/10 border-primary/20">
            <BarChart3 className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Blog</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold">Insights & Tutorials</h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Deep dives into data science, machine learning, cloud, and analytics.
          </p>
        </motion.section>

        {featuredPost && (
          <PostCard post={featuredPost} onPreview={() => openPreview(featuredPost)} />
        )}

        <section className="space-y-6">
          <AnimatePresence mode="popLayout">
            {displayed.length === 0 ? (
              <EmptyState
                title="No posts match your filters"
                subtitle="Try clearing a filter or searching for a different term."
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayed.map((post) => (
                  <PostCard key={post.id} post={post} onPreview={() => openPreview(post)} />
                ))}
              </div>
            )}
          </AnimatePresence>

          {displayed.length > 0 && displayed.length < nonFeatured.length && (
            <div className="flex justify-center py-8">
              <AnimatedButton
                variant="outline"
                onClick={() => setVisibleCount((v) => v + 9)}
                className="px-8 btn-outline-premium"
              >
                View More <ArrowRight className="w-4 h-4 ml-2" />
              </AnimatedButton>
            </div>
          )}
          <div ref={loadMoreRef} aria-hidden className="h-px" />
        </section>

        <BlogPreviewModal post={previewPost} onClose={closePreview} />
      </div>
    </div>
  );
}

export default BlogGrid;
