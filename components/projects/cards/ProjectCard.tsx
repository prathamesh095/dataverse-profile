"use client";

import React, { memo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Project } from "@/lib/types";
import { cn } from "@/lib/utils";
import { getProjectIcon } from "@/components/projects/icons/getProjectIcon";
import { ProjectActions } from "@/components/projects/actions/ProjectActions";

type Props = {
  project: Project;
  onPreviewClick: (p: Project) => void;
  viewMode: "grid" | "list";
};

export const ProjectCard = memo(function ProjectCard({
  project,
  onPreviewClick,
  viewMode,
}: Props) {
  const router = useRouter();
  const Icon = getProjectIcon(project.process[0]?.icon);

  // ------------------------------------------------------
  // LIST VIEW
  // ------------------------------------------------------
  if (viewMode === "list") {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        className="group"
      >
        <Card
          onClick={() => router.push(`/projects/${project.id}`)}
          className="cursor-pointer hover:shadow-xl transition-all duration-300 border border-primary/20 bg-card/60 backdrop-blur-sm hover:bg-card/90"
        >
          <div className="flex flex-col sm:flex-row gap-6 p-6 items-start">
            <Image
              src={project.image}
              alt={`Preview of project ${project.title}`}
              width={128}
              height={128}
              className="w-full sm:w-32 h-32 object-cover rounded-lg shadow-md"
              placeholder="empty"
            />

            <div className="flex-1 space-y-4 w-full">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <Icon className="w-5 h-5 text-primary" />
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {project.title}
                  </CardTitle>
                </div>

                <div className="flex gap-2">
                  <Badge className="bg-linear-to-r from-primary to-secondary text-white text-xs">
                    {project.category}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {project.domain}
                  </Badge>
                </div>
              </div>

              <CardDescription className="text-base">
                {project.description}
              </CardDescription>

              <div className="flex flex-wrap gap-2">
                {project.technologies.slice(0, 6).map((t) => (
                  <Badge key={t} variant="outline" className="text-xs">
                    {t}
                  </Badge>
                ))}
                {project.technologies.length > 6 && (
                  <Badge variant="outline" className="text-xs">
                    +{project.technologies.length - 6}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Actions outside card so clicking them won't trigger navigation */}
        <div className="px-6 pb-6 pt-0">
          <ProjectActions
            project={project}
            onPreviewClick={onPreviewClick}
            isListView
          />
        </div>
      </motion.div>
    );
  }

  // ------------------------------------------------------
  // GRID VIEW
  // ------------------------------------------------------
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      whileHover={{ y: -4 }}
      className="group h-full"
    >
      <Card
        onClick={() => router.push(`/projects/${project.id}`)}
        className={cn(
          "cursor-pointer h-full flex flex-col hover:shadow-xl transition-all duration-300 border border-primary/20",
          "bg-card/60 backdrop-blur-sm hover:bg-card/90 overflow-hidden"
        )}
      >
        <CardHeader className="p-0 relative overflow-hidden">
          <Image
            src={project.image}
            alt={`Preview of project ${project.title}`}
            width={400}
            height={192}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            placeholder="empty"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
          <Badge className="absolute top-3 left-3 text-xs font-semibold bg-linear-to-r from-primary to-secondary text-white">
            {project.category}
          </Badge>
          <Badge variant="secondary" className="absolute top-3 right-3 text-xs">
            {project.domain}
          </Badge>
        </CardHeader>

        <CardContent className="p-6 flex-1 flex flex-col">
          <div className="flex items-center mb-2">
            <Icon className="w-4 h-4 text-primary mr-2" />
            <CardTitle className="text-lg group-hover:text-primary transition-colors">
              {project.title}
            </CardTitle>
          </div>

          <CardDescription className="mb-4 line-clamp-3">
            {project.description}
          </CardDescription>

          <div className="flex flex-wrap gap-1 mt-auto">
            {project.technologies.slice(0, 3).map((t) => (
              <Badge key={t} variant="outline" className="text-xs">
                {t}
              </Badge>
            ))}
            {project.technologies.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{project.technologies.length - 3}
              </Badge>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-6 pt-0 border-t mt-auto">
          {/* Clicking actions will NOT navigate card */}
          <div
            className="w-full flex justify-center sm:justify-start"
            onClick={(e) => e.stopPropagation()}
          >
            <ProjectActions project={project} onPreviewClick={onPreviewClick} />
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
});

ProjectCard.displayName = "ProjectCard";
