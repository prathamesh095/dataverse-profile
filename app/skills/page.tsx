import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { SkillsMatrix } from "@/components/skills-matrix"
import { CertificationsGrid } from "@/components/certifications-grid"

export const metadata = {
  title: "Skills & Expertise | Prathamesh Sanjay Pawar",
  description:
    "Comprehensive overview of my technical skills, tools, and certifications in data science and analytics.",
}

export default function SkillsPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Skills & Expertise</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A comprehensive overview of my technical skills, tools, and certifications across data science, machine
              learning, and business intelligence.
            </p>
          </div>

          <SkillsMatrix />
          <CertificationsGrid />
        </div>
      </main>
      <Footer />
    </div>
  )
}
