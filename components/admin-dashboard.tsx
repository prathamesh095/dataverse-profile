"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart3,
  Users,
  Mail,
  FileText,
  Eye,
  TrendingUp,
  MessageSquare,
  Settings,
  Download,
  RefreshCw,
} from "lucide-react"

// Mock data - in a real app, this would come from an API
const analyticsData = {
  totalViews: 15420,
  uniqueVisitors: 8934,
  contactSubmissions: 47,
  blogViews: 6789,
  projectViews: 4521,
  dashboardViews: 4110,
}

const recentContacts = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.j@techcorp.com",
    company: "TechCorp Solutions",
    projectType: "ML Model Development",
    message: "Looking for help with customer churn prediction model...",
    date: "2024-01-15",
    status: "new",
  },
  {
    id: 2,
    name: "Michael Chen",
    email: "m.chen@startup.io",
    company: "DataStart Inc",
    projectType: "Dashboard Development",
    message: "Need a real-time analytics dashboard for our SaaS platform...",
    date: "2024-01-14",
    status: "replied",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    email: "emily@consulting.com",
    company: "Analytics Consulting",
    projectType: "Training & Workshops",
    message: "Interested in data science training for our team...",
    date: "2024-01-13",
    status: "scheduled",
  },
]

const contentStats = [
  { type: "Projects", count: 12, published: 10, drafts: 2 },
  { type: "Blog Posts", count: 24, published: 22, drafts: 2 },
  { type: "Dashboards", count: 8, published: 8, drafts: 0 },
  { type: "Case Studies", count: 6, published: 5, drafts: 1 },
]

export function AdminDashboard() {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsRefreshing(false)
  }

  return (
    <div className="space-y-8">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Views</p>
                <p className="text-2xl font-bold">{analyticsData.totalViews.toLocaleString()}</p>
              </div>
              <Eye className="w-8 h-8 text-primary" />
            </div>
            <div className="flex items-center mt-2 text-sm">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-500">+12.5%</span>
              <span className="text-muted-foreground ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Unique Visitors</p>
                <p className="text-2xl font-bold">{analyticsData.uniqueVisitors.toLocaleString()}</p>
              </div>
              <Users className="w-8 h-8 text-primary" />
            </div>
            <div className="flex items-center mt-2 text-sm">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-500">+8.2%</span>
              <span className="text-muted-foreground ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Contact Submissions</p>
                <p className="text-2xl font-bold">{analyticsData.contactSubmissions}</p>
              </div>
              <Mail className="w-8 h-8 text-primary" />
            </div>
            <div className="flex items-center mt-2 text-sm">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-500">+23.1%</span>
              <span className="text-muted-foreground ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Blog Views</p>
                <p className="text-2xl font-bold">{analyticsData.blogViews.toLocaleString()}</p>
              </div>
              <FileText className="w-8 h-8 text-primary" />
            </div>
            <div className="flex items-center mt-2 text-sm">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-500">+15.7%</span>
              <span className="text-muted-foreground ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="contacts" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="contacts">Contact Submissions</TabsTrigger>
            <TabsTrigger value="content">Content Management</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        <TabsContent value="contacts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="w-5 h-5 mr-2" />
                Recent Contact Submissions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentContacts.map((contact) => (
                  <div key={contact.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{contact.name}</h4>
                        <p className="text-sm text-muted-foreground">{contact.email}</p>
                        <p className="text-sm text-muted-foreground">{contact.company}</p>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant={
                            contact.status === "new"
                              ? "default"
                              : contact.status === "replied"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {contact.status}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(contact.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="mb-3">
                      <Badge variant="outline" className="text-xs">
                        {contact.projectType}
                      </Badge>
                    </div>

                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{contact.message}</p>

                    <div className="flex gap-2">
                      <Button size="sm">Reply</Button>
                      <Button size="sm" variant="outline">
                        Mark as Read
                      </Button>
                      <Button size="sm" variant="outline">
                        Schedule Call
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Content Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {contentStats.map((stat) => (
                  <div key={stat.type} className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-2">{stat.type}</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Total:</span>
                        <span className="font-medium">{stat.count}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Published:</span>
                        <span className="text-green-600">{stat.published}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Drafts:</span>
                        <span className="text-orange-600">{stat.drafts}</span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="w-full mt-3 bg-transparent">
                      Manage {stat.type}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Page Views Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Blog Posts</span>
                    <span className="font-medium">{analyticsData.blogViews.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Projects</span>
                    <span className="font-medium">{analyticsData.projectViews.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Dashboards</span>
                    <span className="font-medium">{analyticsData.dashboardViews.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Export Data</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Download className="w-4 h-4 mr-2" />
                  Export Analytics Report
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Download className="w-4 h-4 mr-2" />
                  Export Contact List
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Download className="w-4 h-4 mr-2" />
                  Export Content Backup
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Portfolio Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline">Update Profile Information</Button>
                <Button variant="outline">Manage SEO Settings</Button>
                <Button variant="outline">Configure Analytics</Button>
                <Button variant="outline">Update Contact Information</Button>
                <Button variant="outline">Manage Social Links</Button>
                <Button variant="outline">Backup Portfolio Data</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
