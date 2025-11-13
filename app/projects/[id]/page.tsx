// app/projects/[id]/page.tsx
import { notFound } from "next/navigation";
import { projects } from "@/lib/types";
import dynamic from "next/dynamic";

// ✅ Dynamically import the ProjectDetails component (no inline loader — handled by loading.tsx)
const ProjectDetails = dynamic(() => import("@/components/project-details"), {
  ssr: false,
});

export const metadata = {
  title: "Project Details | Prathamesh Sanjay Pawar",
  description:
    "Explore detailed case studies, tech stacks, and achievements for each project.",
};

// ✅ Pre-generate static paths at build time
export async function generateStaticParams() {
  return projects.map((p) => ({
    id: p.id,
  }));
}

// ✅ Render the correct project details based on URL parameter
export default function ProjectDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const project = projects.find((p) => p.id === params.id);

  // Show Next.js 404 page if invalid ID
  if (!project) {
    notFound();
  }

  return <ProjectDetails project={project} />;
}
