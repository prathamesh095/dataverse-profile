"use client";

import { memo, useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Eye, Download, ZoomIn } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatedButton } from "../components/AnimatedButton";
import { scaleIn } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { Project } from "@/lib/types";
import { Lightbox } from "../components/Lightbox";

function GallerySection({ project }: { project: Project }) {
  const [expanded, setExpanded] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [index, setIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);

  const visibleGallery = useMemo(() => {
    if (!project.gallery) return [];
    return expanded
      ? project.gallery
      : project.gallery.slice(0, Math.min(6, project.gallery.length));
  }, [expanded, project.gallery]);

  const handleSelect = useCallback((img: string, i: number) => {
    setSelected(img);
    setIndex(i);
  }, []);

  const handleCopy = useCallback(async () => {
    if (!selected) return;
    try {
      await navigator.clipboard.writeText(selected);
      alert("Image link copied!");
    } catch {
      console.error("Clipboard permission denied.");
    }
  }, [selected]);

  const handleDownload = useCallback(() => {
    if (!selected) return;
    const a = document.createElement("a");
    a.href = selected;
    a.download = selected.split("/").pop() || "image";
    a.click();
  }, [selected]);

  const handleDownloadAll = useCallback(() => {
    project.gallery?.forEach((src) => {
      const a = document.createElement("a");
      a.href = src;
      a.download = src.split("/").pop() || "image";
      a.click();
    });
  }, [project.gallery]);

  return (
    <Card>
      <CardContent className="p-6 sm:p-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
            <Eye className="w-7 h-7 text-primary" /> Gallery
          </h2>
          <div className="flex gap-2">
            {project.gallery.length > 6 && (
              <AnimatedButton
                variant="outline"
                size="sm"
                onClick={() => setExpanded((v) => !v)}
              >
                {expanded ? "Collapse" : "View All"}
              </AnimatedButton>
            )}
            <AnimatedButton variant="outline" size="sm" onClick={handleDownloadAll}>
              <Download className="w-4 h-4 mr-1" /> Download All
            </AnimatedButton>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-4">
          Click any image to open the lightbox. Use ← / → keys to navigate.
        </p>

        <div className={cn("grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4")}>
          {visibleGallery.map((img, i) => (
            <motion.button
              key={`${img}-${i}`}
              variants={scaleIn(0.03 * (i % 8))}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, amount: 0.25 }}
              onClick={() => handleSelect(img, i)}
              className="group relative aspect-4/3 rounded-lg overflow-hidden border border-primary/15 bg-muted/40"
            >
              <Image
                src={img}
                alt={`Screenshot ${i + 1}`}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="rounded-full bg-black/40 text-white p-2 backdrop-blur">
                  <ZoomIn className="w-5 h-5" />
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        <Lightbox
          selectedImage={selected}
          total={project.gallery.length}
          index={index}
          autoPlay={autoPlay}
          onClose={() => setSelected(null)}
          onPrev={() => setIndex((prev) => (prev - 1 + project.gallery.length) % project.gallery.length)}
          onNext={() => setIndex((prev) => (prev + 1) % project.gallery.length)}
          onTogglePlay={() => setAutoPlay((v) => !v)}
          onDownload={handleDownload}
          onCopyLink={handleCopy}
        />
      </CardContent>
    </Card>
  );
}

export default memo(GallerySection);
