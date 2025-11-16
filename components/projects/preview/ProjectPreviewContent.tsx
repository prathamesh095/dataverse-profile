// /components/projects/preview/ProjectPreviewContent.tsx
import React, { memo, useCallback } from "react";
import Image from "next/image";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Project } from "@/lib/types";
import { getProjectIcon } from "@/components/projects/Icons/getProjectIcon";
import { ProjectActions } from "@/components/projects/actions/ProjectActions";
import { cn } from "@/lib/utils";

type Props = {
  project: Project;
  onClose: () => void;
};

export const ProjectPreviewContent = memo(function ProjectPreviewContent({
  project,
  onClose,
}: Props) {
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
          <Image
            src={project.image}
            alt={`Detailed preview of project ${project.title}`}
            width={800}
            height={256}
            className="w-full h-64 object-cover"
            placeholder="empty"
          />
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
          <p className="text-muted-foreground">{project.fullDescription || project.description}</p>
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
                <span className="text-xs text-muted-foreground capitalize">{k.replace(/([A-Z])/g, " $1").trim()}</span>
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

        <div className="flex justify-center pt-4 border-t">
          <div className="inline-flex flex-wrap gap-3 justify-center items-center max-w-md">
            <ProjectActions project={project} isPreview onPreviewClick={closeAndNavigate} />
          </div>
        </div>
      </div>
    </>
  );
},
(prev, next) => prev.project.id === next.project.id && prev.onClose === next.onClose);
ProjectPreviewContent.displayName = "ProjectPreviewContent";
