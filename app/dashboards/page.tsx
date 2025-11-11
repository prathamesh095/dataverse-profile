import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { DashboardsGrid } from "@/components/dashboards-grid"

export const metadata = {
  title: "Dashboards | Prathamesh Sanjay Pawar",
  description:
    "Interactive data visualizations and business intelligence dashboards built with Tableau, Power BI, and custom solutions.",
}

export default function DashboardsPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Interactive Dashboards</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Data visualization dashboards that transform complex datasets into actionable business insights.
            </p>
          </div>

          <DashboardsGrid />
        </div>
      </main>
      <Footer />
    </div>
  )
}
