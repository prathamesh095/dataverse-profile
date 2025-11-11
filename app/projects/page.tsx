// app/projects/page.tsx
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ProjectsGrid } from "@/components/projects-grid"
// Removed: import { ProjectFilters } from "@/components/project-filters"

export const metadata = {
  title: "Projects | Prathamesh Sanjay Pawar",
  description: "Explore my data science and machine learning projects with detailed case studies and implementations.",
}

export default function ProjectsPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Projects Portfolio</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A collection of data science and machine learning projects showcasing my expertise in analytics, modeling,
              and business intelligence.
            </p>
          </div>

          {/* Removed: <ProjectFilters /> */}
          <ProjectsGrid />
        </div>
      </main>
      <Footer />
    </div>
  )
}