import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { TimelineSection } from "@/components/timeline-section"
import { PersonalStory } from "@/components/personal-story"

export const metadata = {
  title: "About Me | Prathamesh Pawar",
  description: "Learn about my journey in data science, professional experience, and personal interests.",
}

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <PersonalStory />
          <TimelineSection />
        </div>
      </main>
      <Footer />
    </div>
  )
}
