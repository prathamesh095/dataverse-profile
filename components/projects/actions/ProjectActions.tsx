"use client";

import React, { memo } from "react";
import Link from "next/link";
import { Eye, Github, BarChart3 } from "lucide-react";
import { AnimatedButton as _AnimatedButton } from "@/components/projects/internal/AnimatedButtonShim";
import { Project } from "@/lib/types";

type Props = {
  project: Project;
  onPreviewClick?: (p: Project) => void;
  isPreview?: boolean;
  isListView?: boolean;
};

/**
 * ✅ ProjectActions
 * -------------------------------------------------------------------
 * - Prevents nested <a> tags (safe inside cards with Links)
 * - Uses <button> for preview (client-side modal)
 * - Uses <Link> only for internal routes when NOT already inside a <Link>
 * - Uses <a> only for external targets (GitHub, dashboards)
 * - Accessible, motion-safe, hydration-safe
 * -------------------------------------------------------------------
 */
export const ProjectActions = memo(function ProjectActions({
  project,
  onPreviewClick,
  isPreview = false,
  isListView = false,
}: Props) {
  const isExternalLink = (url?: string) => url && (url.startsWith("http") || url.startsWith("https"));

  return (
    <div className="flex flex-wrap gap-3 items-center justify-center sm:justify-start">
      {/* 🟣 Preview Button (local modal) */}
      {!isPreview && onPreviewClick && (
        <_AnimatedButton
          size={isListView ? "sm" : "default"}
          variant="secondary"
          className="min-w-[110px]"
          onClick={(e) => {
            e.preventDefault();
            onPreviewClick(project);
          }}
        >
          <Eye className="w-4 h-4 mr-2" /> Preview
        </_AnimatedButton>
      )}

      {/* 🟢 Internal Navigation (safe) */}
      {!isPreview && (
        <_AnimatedButton
          size={isListView ? "sm" : "default"}
          variant="default"
          className="min-w-[110px]"
          asChild
        >
          <Link href={`/projects/${project.id}`} prefetch>
            <Eye className="w-4 h-4 mr-2" /> Details
          </Link>
        </_AnimatedButton>
      )}

      {/* 🧠 Full Details (used inside preview modal only) */}
      {isPreview && (
        <_AnimatedButton
          size="sm"
          variant="default"
          asChild
          className="min-w-[110px]"
        >
          <Link href={`/projects/${project.id}`} prefetch>
            <Eye className="w-4 h-4 mr-2" /> Full Details
          </Link>
        </_AnimatedButton>
      )}

      {/* 🐙 GitHub Code Link (external) */}
      {isExternalLink(project.links?.github) && (
        <_AnimatedButton
          variant="outline"
          size={isListView ? "sm" : "default"}
          asChild
          className="btn-outline-premium"
        >
          <a
            href={project.links.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View ${project.title} on GitHub`}
          >
            <Github className="w-4 h-4 mr-1" /> Code
          </a>
        </_AnimatedButton>
      )}

      {/* 📊 Dashboard Link (external) */}
      {isExternalLink(project.links?.dashboard) && (
        <_AnimatedButton
          variant="outline"
          size={isListView ? "sm" : "default"}
          asChild
          className="btn-outline-premium"
        >
          <a
            href={project.links.dashboard}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open ${project.title} dashboard`}
          >
            <BarChart3 className="w-4 h-4 mr-1" /> Dashboard
          </a>
        </_AnimatedButton>
      )}
    </div>
  );
});

ProjectActions.displayName = "ProjectActions";
