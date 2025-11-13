"use client"

import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, Star, BarChart3 } from "lucide-react"
import { Project } from "@/lib/types"

export default function StatsSection({ project }: { project: Project }) {
  return (
    <Card className="animate-on-scroll">
      <CardContent className="p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 flex items-center gap-3">
          <TrendingUp className="w-7 h-7 text-primary" /> Stats & Metrics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Star className="w-5 h-5 text-primary" /> Performance Highlights
            </h3>
            <ul className="space-y-3">
              {Object.entries(project.metrics).map(([key, value]) => (
                <li key={key} className="flex justify-between text-sm">
                  <span className="text-muted-foreground capitalize">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </span>
                  <span className="font-semibold text-primary">{value}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-muted/50 rounded-xl p-6 flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="w-16 h-16 text-primary mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Explore detailed analytics in the dashboard
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
