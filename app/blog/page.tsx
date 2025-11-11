import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { BlogGrid } from "@/components/blog-grid"

export const metadata = {
  title: "Blog & Insights | Prathamesh Sanjay Pawar",
  description: "Data science insights, tutorials, and industry analysis from a practicing data scientist.",
}

export default function BlogPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Blog & Insights</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Sharing knowledge, insights, and experiences from the world of data science, machine learning, and
              analytics.
            </p>
          </div>

          <div className="space-y-8">
            <BlogGrid />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
