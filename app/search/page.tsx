import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { GlobalSearch } from "@/components/global-search"

export const metadata = {
  title: "Search | Prathamesh Sanjay Pawar",
  description: "Search across projects, blog posts, skills, and portfolio content.",
}

export default function SearchPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Search Portfolio</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Find projects, blog posts, skills, and insights across my entire portfolio.
            </p>
          </div>

          <GlobalSearch />
        </div>
      </main>
      <Footer />
    </div>
  )
}
