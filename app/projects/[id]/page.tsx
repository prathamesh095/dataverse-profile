import { projects, Project } from "@/lib/types";
import ProjectDetailsClient from "./ProjectDetailsClient";

export async function generateStaticParams() {
  return projects.map((project) => ({
    id: project.id,
  }));
}

export default function ProjectDetailsPage({ params }: { params: { id: string } }) {
  const project = projects.find((p) => p.id === params.id);

  return <ProjectDetailsClient project={project} />;
}