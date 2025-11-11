import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { AdminDashboard } from "@/components/admin-dashboard"

export const metadata = {
  title: "Admin Dashboard | Prathamesh Sanjay Pawar",
  description: "Administrative dashboard for portfolio management.",
}

export default function AdminPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage portfolio content, view analytics, and handle contact submissions.
            </p>
          </div>

          <AdminDashboard />
        </div>
      </main>
      <Footer />
    </div>
  )
}
