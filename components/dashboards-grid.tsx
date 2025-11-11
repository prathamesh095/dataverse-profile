"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ExternalLink, Maximize2, BarChart3, PieChart, TrendingUp, Users, DollarSign, Package } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Define types for the dashboard data
type DashboardMetrics = string[]

interface Dashboard {
  id: string
  title: string
  description: string
  image: string
  platform: string
  dataSource: string
  kpis: DashboardMetrics
  interactivity: string
  businessImpact: string
  embedUrl: string
  icon: React.ComponentType<{ className?: string }>
  featured?: boolean
  year: number
  tags: string[]
  achievements?: string[]
}

const dashboards: Dashboard[] = [
  {
    id: "sales-performance",
    title: "Sales Performance Dashboard",
    description:
      "Real-time sales analytics with KPI tracking, regional performance, and trend analysis across 12 regions.",
    image: "/sales-performance-dashboard-tableau.jpg",
    platform: "Tableau",
    dataSource: "SQL Server, Salesforce",
    kpis: ["Revenue", "Conversion Rate", "Customer Acquisition", "Regional Performance"],
    interactivity: "Filters, drill-down, real-time updates",
    businessImpact: "Improved sales planning efficiency by 40%",
    embedUrl: "https://public.tableau.com/views/SalesPerformance/Dashboard",
    icon: DollarSign,
    featured: true,
    year: 2024,
    tags: ["Real-time", "Executive"],
    achievements: ["Increased sales efficiency by 40%", "Deployed across 12 regions"],
  },
  {
    id: "customer-analytics",
    title: "Customer Analytics Dashboard",
    description:
      "Comprehensive customer behavior analysis with segmentation, lifetime value, and churn prediction insights.",
    image: "/customer-analytics-dashboard.jpg",
    platform: "Power BI",
    dataSource: "Azure SQL, Google Analytics",
    kpis: ["Customer LTV", "Churn Rate", "Segmentation", "Engagement Score"],
    interactivity: "Dynamic filtering, cross-filtering, mobile responsive",
    businessImpact: "Reduced customer churn by 23%",
    embedUrl: "https://app.powerbi.com/view?r=customer-analytics",
    icon: Users,
    year: 2023,
    tags: ["Customer Insights", "Predictive"],
    achievements: ["Reduced churn by 23%", "Integrated with CRM"],
  },
  {
    id: "financial-reporting",
    title: "Financial Reporting Dashboard",
    description: "Executive financial dashboard with P&L analysis, budget vs actual, and cash flow forecasting.",
    image: "/financial-reporting-dashboard.jpg",
    platform: "Tableau",
    dataSource: "SAP, Excel, QuickBooks",
    kpis: ["Revenue", "Profit Margin", "Cash Flow", "Budget Variance"],
    interactivity: "Time period selection, department filtering",
    businessImpact: "Reduced reporting time by 60%",
    embedUrl: "https://public.tableau.com/views/FinancialReporting/Dashboard",
    icon: TrendingUp,
    year: 2023,
    tags: ["Financial", "Executive"],
    achievements: ["Cut reporting time by 60%", "Streamlined budgeting process"],
  },
  {
    id: "supply-chain",
    title: "Supply Chain Analytics",
    description:
      "End-to-end supply chain visibility with inventory levels, supplier performance, and logistics optimization.",
    image: "/supply-chain-optimization.mp4",
    platform: "Custom React",
    dataSource: "PostgreSQL, API integrations",
    kpis: ["Inventory Turnover", "Supplier Performance", "Delivery Time", "Cost Optimization"],
    interactivity: "Real-time updates, predictive alerts",
    businessImpact: "Reduced supply chain costs by 15%",
    embedUrl: "/dashboards/supply-chain/embed",
    icon: Package,
    year: 2022,
    tags: ["Supply Chain", "Real-time"],
    achievements: ["Reduced costs by 15%", "Improved delivery times by 18%"],
  },
  {
    id: "marketing-performance",
    title: "Marketing Performance Dashboard",
    description: "Multi-channel marketing analytics with campaign performance, ROI tracking, and attribution modeling.",
    image: "/marketing-performance-dashboard.jpg",
    platform: "Plotly Dash",
    dataSource: "Google Ads, Facebook Ads, HubSpot",
    kpis: ["ROAS", "CAC", "Attribution", "Channel Performance"],
    interactivity: "Campaign comparison, date range selection",
    businessImpact: "Improved marketing ROI by 35%",
    embedUrl: "/dashboards/marketing-performance/embed",
    icon: BarChart3,
    year: 2024,
    tags: ["Marketing", "ROI"],
    achievements: ["Improved ROI by 35%", "Optimized ad spend"],
  },
  {
    id: "operational-metrics",
    title: "Operational Metrics Dashboard",
    description:
      "Real-time operational KPIs with performance monitoring, resource utilization, and efficiency metrics.",
    image: "/operational-metrics-dashboard.gif",
    platform: "Streamlit",
    dataSource: "MongoDB, IoT sensors, ERP",
    kpis: ["OEE", "Resource Utilization", "Quality Score", "Downtime"],
    interactivity: "Live monitoring, alert system",
    businessImpact: "Increased operational efficiency by 28%",
    embedUrl: "/dashboards/operational-metrics/embed",
    icon: PieChart,
    year: 2022,
    tags: ["Operational", "IoT"],
    achievements: ["Improved efficiency by 28%", "Reduced downtime by 20%"],
  },
]

const kpiExplanations: Record<string, string> = {
  Revenue: "Total income generated from sales activities",
  "Conversion Rate": "Percentage of visitors who complete a desired action",
  "Customer Acquisition": "Metrics related to gaining new customers",
  "Regional Performance": "Sales performance across different regions",
  "Customer LTV": "Lifetime value of a customer",
  "Churn Rate": "Percentage of customers who stop using the service",
  Segmentation: "Grouping customers based on behavior or demographics",
  "Engagement Score": "Measure of customer interaction with the platform",
  "Profit Margin": "Percentage of revenue that turns into profit",
  "Cash Flow": "Net amount of cash moving in and out of the business",
  "Budget Variance": "Difference between planned and actual budget",
  "Inventory Turnover": "Rate at which inventory is sold and replaced",
  "Supplier Performance": "Metrics evaluating supplier reliability and efficiency",
  "Delivery Time": "Time taken to deliver goods to customers",
  "Cost Optimization": "Reduction in operational costs",
  ROAS: "Return on Advertising Spend, measuring campaign efficiency",
  CAC: "Customer Acquisition Cost, cost to acquire a new customer",
  Attribution: "Assigning credit to marketing channels for conversions",
  "Channel Performance": "Effectiveness of different marketing channels",
  OEE: "Overall Equipment Effectiveness, measuring manufacturing productivity",
  "Resource Utilization": "Efficiency in using available resources",
  "Quality Score": "Metric assessing product or service quality",
  Downtime: "Time when operations are halted",
}

function KpiBadges({ kpis }: { kpis: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5 overflow-x-auto pb-2">
      {kpis.map((kpi) => (
        <TooltipProvider key={kpi}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="secondary" className="text-xs px-2 py-0.5 whitespace-nowrap bg-secondary/80 hover:bg-secondary transition-colors">
                {kpi}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>{kpiExplanations[kpi] || kpi}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  )
}

function TagsBadges({ tags }: { tags: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((tag) => (
        <Badge key={tag} variant="outline" className="text-xs px-2 py-0.5 border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors">
          {tag}
        </Badge>
      ))}
    </div>
  )
}

function InfoSection({ title, content }: { title: string; content: string }) {
  return (
    <div>
      <h4 className="font-semibold text-sm mb-1 text-foreground">{title}</h4>
      <p className="text-sm text-muted-foreground">{content}</p>
    </div>
  )
}

export function DashboardsGrid() {
  const [previewDashboard, setPreviewDashboard] = useState<Dashboard | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPlatform, setSelectedPlatform] = useState("All")
  const [selectedDataSource, setSelectedDataSource] = useState("All")
  const [sortBy, setSortBy] = useState("recent")

  const platforms = ["All", ...new Set(dashboards.map((d) => d.platform))]
  const dataSources = ["All", ...new Set(dashboards.map((d) => d.dataSource.split(", ")[0]))]

  const filteredDashboards = dashboards.filter((dashboard) => {
    const matchesSearch =
      dashboard.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dashboard.platform.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dashboard.kpis.some((kpi) => kpi.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesPlatform = selectedPlatform === "All" || dashboard.platform === selectedPlatform
    const matchesDataSource = selectedDataSource === "All" || dashboard.dataSource.includes(selectedDataSource)
    return matchesSearch && matchesPlatform && matchesDataSource
  })

  const sortedDashboards = [...filteredDashboards].sort((a, b) => {
    if (sortBy === "recent") {
      return b.year - a.year
    } else if (sortBy === "impact") {
      const impactA = parseFloat(a.businessImpact.replace(/[^0-9.]/g, "")) || 0
      const impactB = parseFloat(b.businessImpact.replace(/[^0-9.]/g, "")) || 0
      return impactB - impactA
    } else if (sortBy === "title") {
      return a.title.localeCompare(b.title)
    }
    return 0
  })

  return (
    <div className="space-y-12">
      {/* Featured Dashboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-4xl font-extrabold mb-10 text-center md:text-left tracking-tight">Featured Dashboard</h2>
        {dashboards
          .filter((d) => d.featured)
          .map((dashboard) => {
            const Icon = dashboard.icon
            const isVideo = dashboard.image.endsWith(".mp4") || dashboard.image.endsWith(".gif")
            return (
              <motion.div
                key={dashboard.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="overflow-hidden border-0 shadow-2xl bg-linear-to-br from-background to-muted/50 rounded-3xl dark:shadow-xl dark:bg-linear-to-br dark:from-muted/20 dark:to-background">
                  <CardContent className="p-0">
                    <div className="grid md:grid-cols-2 gap-0 min-h-[400px]">
                      <motion.div
                        className="relative overflow-hidden"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.4 }}
                      >
                        {isVideo ? (
                          <video
                            src={dashboard.image}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover transition-transform duration-500"
                          />
                        ) : (
                          <Image
                            src={dashboard.image || "/placeholder.svg"}
                            alt={`${dashboard.title} screenshot`}
                            fill
                            className="object-cover transition-transform duration-500"
                            loading="eager"
                            priority
                            sizes="(max-width: 768px) 100vw, 50vw"
                          />
                        )}
                        <div className="absolute inset-0 bg-linear-to-t from-background/80 to-transparent opacity-70 transition-opacity group-hover:opacity-50" />
                        <Badge className="absolute top-6 left-6 bg-primary/95 text-primary-foreground shadow-lg px-3 py-1 rounded-full">
                          {dashboard.platform}
                        </Badge>
                        <Badge className="absolute top-6 right-6 bg-accent/95 text-foreground shadow-lg px-3 py-1 rounded-full">
                          {dashboard.year}
                        </Badge>
                      </motion.div>

                      <div className="p-8 space-y-6 flex flex-col justify-between">
                        <motion.div
                          className="flex items-center gap-3"
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          <Icon className="w-8 h-8 text-primary" />
                          <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                            Featured Dashboard
                          </span>
                        </motion.div>

                        <motion.h3
                          className="text-3xl font-bold leading-tight"
                          initial={{ y: 10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          {dashboard.title}
                        </motion.h3>

                        <motion.p
                          className="text-muted-foreground text-base leading-relaxed"
                          initial={{ y: 10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.4 }}
                        >
                          {dashboard.description}
                        </motion.p>

                        <motion.div
                          initial={{ y: 10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.5 }}
                        >
                          <KpiBadges kpis={dashboard.kpis} />
                          <TagsBadges tags={dashboard.tags} />
                        </motion.div>

                        <motion.div
                          className="space-y-3"
                          initial={{ y: 10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.6 }}
                        >
                          <InfoSection title="Business Impact" content={dashboard.businessImpact} />
                          <InfoSection title="Data Sources" content={dashboard.dataSource} />
                        </motion.div>

                        <motion.div
                          className="flex gap-3 flex-wrap"
                          initial={{ y: 10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.7 }}
                        >
                          <Button
                            variant="default"
                            className="flex-1 min-w-[120px] bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all duration-300 rounded-full px-6 py-5 text-sm font-medium"
                            onClick={() => setPreviewDashboard(dashboard)}
                            aria-label={`Preview ${dashboard.title}`}
                          >
                            <Maximize2 className="w-4 h-4 mr-2" />
                            Preview
                          </Button>
                          <Button asChild className="min-w-[120px] bg-accent hover:bg-accent/90 text-accent-foreground shadow-md hover:shadow-lg transition-all duration-300 rounded-full px-6 py-5 text-sm font-medium">
                            <Link href={`/dashboards/${dashboard.id}`} aria-label={`View full dashboard of ${dashboard.title}`}>
                              <Maximize2 className="w-4 h-4 mr-2" />
                              Full Dashboard
                            </Link>
                          </Button>
                          <Button variant="outline" asChild className="min-w-[120px] border-primary/50 hover:bg-primary/10 shadow-md hover:shadow-lg transition-all duration-300 rounded-full px-6 py-5 text-sm font-medium">
                            <a
                              href={dashboard.embedUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`Open ${dashboard.title} in ${dashboard.platform}`}
                            >
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Open in {dashboard.platform}
                            </a>
                          </Button>
                        </motion.div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
      </motion.div>

      {/* All Dashboards Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <h2 className="text-4xl font-extrabold mb-10 text-center md:text-left tracking-tight">All Dashboards</h2>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-10">
          <Input
            placeholder="Search by title, platform, or KPI..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md rounded-full px-6 py-5 shadow-inner"
          />
          <Tabs value={selectedPlatform} onValueChange={setSelectedPlatform} className="min-w-[300px]">
            <TabsList className="rounded-full bg-muted p-1">
              {platforms.map((platform) => (
                <TabsTrigger key={platform} value={platform} className="rounded-full px-4 py-2">
                  {platform}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <Select value={selectedDataSource} onValueChange={setSelectedDataSource}>
            <SelectTrigger className="w-[180px] rounded-full px-4 py-5 shadow-inner">
              <SelectValue placeholder="Filter by Data Source" />
            </SelectTrigger>
            <SelectContent>
              {dataSources.map((source) => (
                <SelectItem key={source} value={source}>
                  {source}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px] rounded-full px-4 py-5 shadow-inner">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Recent</SelectItem>
              <SelectItem value="impact">Business Impact</SelectItem>
              <SelectItem value="title">Title</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedDashboards.map((dashboard, index) => {
            const Icon = dashboard.icon
            const isVideo = dashboard.image.endsWith(".mp4") || dashboard.image.endsWith(".gif")
            return (
              <motion.div
                key={dashboard.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Card className="group overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 rounded-3xl bg-background h-full flex flex-col border border-border/50">
                  <CardContent className="p-0 grow">
                    <motion.div
                      className="relative overflow-hidden h-56"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.4 }}
                    >
                      {isVideo ? (
                        <video
                          src={dashboard.image}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="w-full h-full object-cover transition-transform duration-500"
                        />
                      ) : (
                        <Image
                          src={dashboard.image || "/placeholder.svg"}
                          alt={`${dashboard.title} screenshot`}
                          fill
                          className="object-cover transition-transform duration-500"
                          loading="lazy"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      )}
                      <div className="absolute inset-0 bg-linear-to-t from-background/90 to-transparent opacity-80 group-hover:opacity-70 transition-opacity duration-300" />
                      <Badge className="absolute top-4 left-4 bg-primary/95 text-primary-foreground shadow-md px-3 py-1 rounded-full text-sm">
                        {dashboard.platform}
                      </Badge>
                      <Badge className="absolute top-4 right-4 bg-secondary/95 text-foreground shadow-md px-3 py-1 rounded-full text-sm">
                        {dashboard.year}
                      </Badge>
                    </motion.div>

                    <div className="p-6 space-y-4 flex flex-col grow">
                      <div className="flex items-center gap-2">
                        <Icon className="w-5 h-5 text-primary group-hover:animate-pulse" />
                        <h3 className="font-bold text-xl group-hover:text-primary transition-colors leading-tight">
                          {dashboard.title}
                        </h3>
                      </div>

                      <p className="text-muted-foreground text-sm line-clamp-3 grow">
                        {dashboard.description}
                      </p>

                      <div className="mt-auto space-y-3">
                        <KpiBadges kpis={dashboard.kpis.slice(0, 3)} />
                        {dashboard.kpis.length > 3 && (
                          <Badge variant="outline" className="text-xs px-2 py-0.5">
                            +{dashboard.kpis.length - 3}
                          </Badge>
                        )}
                        <TagsBadges tags={dashboard.tags} />
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="p-6 pt-0 flex gap-2 flex-wrap border-t border-border/50 bg-muted/20">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="flex-1 min-w-[100px] hover:bg-secondary/80 shadow-sm hover:shadow-md transition-all duration-300 rounded-full px-4 py-3 text-xs font-medium"
                      onClick={() => setPreviewDashboard(dashboard)}
                      aria-label={`Preview ${dashboard.title}`}
                    >
                      <Maximize2 className="w-3 h-3 mr-1.5" />
                      Preview
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      asChild
                      className="min-w-[100px] hover:bg-accent/10 border-accent/50 shadow-sm hover:shadow-md transition-all duration-300 rounded-full px-4 py-3 text-xs font-medium"
                    >
                      <Link href={`/dashboards/${dashboard.id}`} aria-label={`View full dashboard of ${dashboard.title}`}>
                        <Maximize2 className="w-3 h-3 mr-1.5" />
                        Full Dashboard
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      asChild
                      className="min-w-[100px] hover:bg-primary/10 border-primary/50 shadow-sm hover:shadow-md transition-all duration-300 rounded-full px-4 py-3 text-xs font-medium"
                    >
                      <a
                        href={dashboard.embedUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Open ${dashboard.title} in ${dashboard.platform}`}
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* Dashboard Preview Modal */}
      <AnimatePresence>
        {previewDashboard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setPreviewDashboard(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 50 }}
              transition={{ duration: 0.3, type: "spring" }}
              className="max-w-4xl w-full max-h-[90vh] overflow-y-auto m-4 rounded-3xl shadow-2xl bg-background"
              onClick={(e) => e.stopPropagation()}
            >
              <Dialog open={true} onOpenChange={() => setPreviewDashboard(null)}>
                <DialogContent className="border-0 rounded-3xl p-0 overflow-hidden">
                  <DialogHeader className="p-6 pb-4 border-b border-border/50">
                    <DialogTitle className="flex items-center gap-3 text-3xl font-bold">
                      {previewDashboard.icon && <previewDashboard.icon className="w-7 h-7 text-primary" />}
                      {previewDashboard.title}
                    </DialogTitle>
                  </DialogHeader>

                  <div className="p-6 space-y-6">
                    {/* Dashboard Image */}
                    <motion.div
                      className="relative overflow-hidden rounded-2xl shadow-lg h-80"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      {previewDashboard.image.endsWith(".mp4") || previewDashboard.image.endsWith(".gif") ? (
                        <video
                          src={previewDashboard.image}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Image
                          src={previewDashboard.image || "/placeholder.svg"}
                          alt={`${previewDashboard.title} screenshot`}
                          fill
                          className="object-cover"
                          loading="lazy"
                          sizes="100vw"
                        />
                      )}
                      <div className="absolute top-4 left-4 flex gap-2">
                        <Badge className="bg-primary/95 text-primary-foreground px-3 py-1 rounded-full shadow-md">{previewDashboard.platform}</Badge>
                        <Badge variant="secondary" className="px-3 py-1 rounded-full shadow-md">{previewDashboard.year}</Badge>
                      </div>
                    </motion.div>

                    {/* Tabs */}
                    <Tabs defaultValue="overview" className="w-full">
                      <TabsList className="grid w-full grid-cols-4 mb-6 rounded-full bg-muted p-1">
                        <TabsTrigger value="overview" className="rounded-full">Overview</TabsTrigger>
                        <TabsTrigger value="kpis" className="rounded-full">KPIs</TabsTrigger>
                        <TabsTrigger value="dataSources" className="rounded-full">Data Sources</TabsTrigger>
                        {previewDashboard.achievements && previewDashboard.achievements.length > 0 && (
                          <TabsTrigger value="achievements" className="rounded-full">Achievements</TabsTrigger>
                        )}
                      </TabsList>
                      <TabsContent value="overview" className="mt-0">
                        <p className="text-muted-foreground text-base leading-relaxed mb-4">{previewDashboard.description}</p>
                        <InfoSection title="Business Impact" content={previewDashboard.businessImpact} />
                        <InfoSection title="Interactivity" content={previewDashboard.interactivity} />
                        <TagsBadges tags={previewDashboard.tags} />
                      </TabsContent>
                      <TabsContent value="kpis" className="mt-0">
                        <KpiBadges kpis={previewDashboard.kpis} />
                      </TabsContent>
                      <TabsContent value="dataSources" className="mt-0">
                        <InfoSection title="Data Sources" content={previewDashboard.dataSource} />
                      </TabsContent>
                      <TabsContent value="achievements" className="mt-0">
                        <ul className="list-disc pl-6 space-y-3 text-muted-foreground text-base">
                          {previewDashboard.achievements?.map((ach, idx) => (
                            <li key={idx} className="leading-relaxed">{ach}</li>
                          ))}
                        </ul>
                      </TabsContent>
                    </Tabs>

                    {/* Action Buttons */}
                    <motion.div
                      className="flex gap-3 pt-6 border-t border-border/50 flex-wrap"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <Button asChild className="flex-1 min-w-[150px] bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all duration-300 rounded-full px-6 py-5 text-sm font-medium">
                        <Link
                          href={`/dashboards/${previewDashboard.id}`}
                          onClick={() => setPreviewDashboard(null)}
                          aria-label={`View full dashboard of ${previewDashboard.title}`}
                        >
                          <Maximize2 className="w-4 h-4 mr-2" />
                          View Full Dashboard
                        </Link>
                      </Button>
                      <Button variant="outline" asChild className="min-w-[150px] border-primary/50 hover:bg-primary/10 shadow-md hover:shadow-lg transition-all duration-300 rounded-full px-6 py-5 text-sm font-medium">
                        <a
                          href={previewDashboard.embedUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Open ${previewDashboard.title} in ${previewDashboard.platform}`}
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Open in {previewDashboard.platform}
                        </a>
                      </Button>
                      <Button variant="outline" asChild className="min-w-[150px] border-secondary/50 hover:bg-secondary/10 shadow-md hover:shadow-lg transition-all duration-300 rounded-full px-6 py-5 text-sm font-medium">
                        <Link
                          href={`/dashboards/${previewDashboard.id}/report.pdf`}
                          aria-label={`Download PDF report for ${previewDashboard.title}`}
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Download PDF
                        </Link>
                      </Button>
                    </motion.div>
                  </div>
                </DialogContent>
              </Dialog>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}