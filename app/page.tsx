import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/hero-section"
import { OverviewTiles } from "@/components/overview-tiles"
import { FeaturedInsights } from "@/components/featured-insights"
import { SmoothScroll } from "@/components/smooth-scroll"
import { PerformanceMonitor } from "@/components/performance-monitor"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <SmoothScroll />
      <PerformanceMonitor />

      <Navigation />
      <main>
        <HeroSection />
        <OverviewTiles />
        <FeaturedInsights />
      </main>
      <Footer />
    </div>
  )
}
