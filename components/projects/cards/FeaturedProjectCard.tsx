"use client";

import React, { memo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Project } from "@/lib/types";
import { cn } from "@/lib/utils";
import { getProjectIcon } from "@/components/projects/Icons/getProjectIcon";
import { ProjectActions } from "@/components/projects/actions/ProjectActions";

type Props = {
  project: Project;
  onPreviewClick: (p: Project) => void;
};

export const FeaturedProjectCard = memo(function FeaturedProjectCard({
  project,
  onPreviewClick,
}: Props) {
  const router = useRouter();
  const Icon = getProjectIcon(project.process[0]?.icon);

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="group"
    >
      <Card
        onClick={() => router.push(`/projects/${project.id}`)}
        className={cn(
          "cursor-pointer overflow-hidden border border-primary/20 bg-card/60 backdrop-blur-sm hover:bg-card/90 transition-all duration-300 hover:shadow-xl"
        )}
      >
        <CardContent className="p-0">
          <div className="grid md:grid-cols-2 gap-0">
            {/* === LEFT IMAGE === */}
            <div className="relative overflow-hidden">
              <Image
                src={project.image}
                alt={`Preview of featured project ${project.title}`}
                width={800}
                height={400}
                className="w-full h-64 md:h-full object-cover transition-transform duration-500 group-hover:scale-105"
                placeholder="empty"
                priority
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
              <Badge
                className={cn(
                  "absolute top-4 left-4 text-xs font-semibold",
                  "bg-linear-to-r from-primary to-secondary text-white"
                )}
              >
                {project.category}
              </Badge>
            </div>

            {/* === RIGHT SIDE CONTENT === */}
            <div className="p-6 md:p-8 flex flex-col justify-center">
              <div className="flex items-center mb-4">
                <Icon className="w-6 h-6 text-primary mr-2" />
                <span className="text-sm text-muted-foreground">Featured Project</span>
              </div>

              <CardTitle className="text-2xl mb-4 group-hover:text-primary transition-colors">
                {project.title}
              </CardTitle>

              <CardDescription className="mb-6 text-base">
                {project.tagline}
              </CardDescription>

              {project.metrics && (
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
              )}

              <div className="flex flex-wrap gap-2 mb-6">
                {project.technologies.map((t) => (
                  <Badge key={t} variant="outline">
                    {t}
                  </Badge>
                ))}
              </div>

              {/* === ACTIONS === */}
              <div
                className="flex justify-center sm:justify-start"
                onClick={(e) => e.stopPropagation()} // prevent card click here
              >
                <ProjectActions project={project} onPreviewClick={onPreviewClick} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
});

FeaturedProjectCard.displayName = "FeaturedProjectCard";
