"use client"

import { useState, useEffect, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, Filter, Calendar, ArrowRight } from "lucide-react"
import Link from "next/link"

// --- Import Mock Data if needed (Assuming these are structured arrays) ---
// Since I don't have these files, I will rely on the structure defined in the function body.
// For a production environment, ensure these imports point to actual data files.

// Placeholder imports (replace with actual data imports in your final setup)
import { skillCategories } from "@/lib/skills"
import { projects } from "@/lib/types"
import { blogPosts } from "@/lib/blogs"
import { certifications } from "@/lib/certifications"

// Type definitions - URL is now optional, but we ensure it's a string during mapping.
interface SearchItem {
  id: string
  type: "project" | "dashboard" | "blog" | "skill" | "certification"
  title: string
  description: string
  category: string
  tags: string[]
  url: string // Still enforcing string here, relying on safe mapping below
  date: string
  stars?: number
  language?: string
}

export function GlobalSearch() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchItem[]>([])
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [isSearching, setIsSearching] = useState(false)
  const [githubRepos, setGithubRepos] = useState<SearchItem[]>([])

  // Function to parse lastUsed to date string
  const parseLastUsed = (lastUsed: string): string => {
    // Note: Used a fixed date '2025-10-23' for relative time calculation, common practice for static portfolio.
    const now = new Date('2025-10-23')
    if (lastUsed === 'Today') return now.toISOString().split('T')[0]

    const match = lastUsed.match(/(\d+) (\w+) ago/)
    if (match) {
      const num = parseInt(match[1])
      const unit = match[2]
      const date = new Date(now)
      if (unit.startsWith('day')) date.setDate(date.getDate() - num)
      if (unit.startsWith('week')) date.setDate(date.getDate() - num * 7)
      return date.toISOString().split('T')[0]
    }

    return '2025-10-23' // default fallback
  }

  // Map local data - Memoized for performance
  const localData = useMemo(() => {
    // Defensive checks for data existence (crucial for production)
    if (!skillCategories || !projects || !blogPosts || !certifications) return []

    // Skills
    const skillsMapped: SearchItem[] = skillCategories.flatMap(cat =>
      cat.skills.map(skill => ({
        id: skill.name.toLowerCase().replace(/\s/g, '-'),
        type: "skill" as const,
        title: skill.name,
        description: `Proficiency: ${skill.level}% | Projects: ${skill.projects} | Experience: ${skill.yearsOfExperience} years | Last Used: ${skill.lastUsed}`,
        category: cat.title,
        tags: [cat.id],
        url: `/skills#${cat.id}`,
        date: parseLastUsed(skill.lastUsed),
      }))
    )

    // Projects
    const projectsMapped: SearchItem[] = projects.map(project => ({
      id: project.id,
      type: "project" as const,
      title: project.title,
      description: project.tagline,
      category: project.category,
      tags: project.tags,
      url: `/projects/${project.id}`,
      date: `${project.year}-01-01`, // Use year for sorting
    }))

    // Blogs
    const blogsMapped: SearchItem[] = blogPosts.map(blog => ({
      id: blog.id,
      type: "blog" as const,
      title: blog.title,
      description: blog.excerpt,
      category: blog.category,
      tags: blog.tags,
      url: `/blog/${blog.id}`,
      date: blog.publishDate,
    }))

    // Certifications
    // --- FIX APPLIED HERE: Using ?? "" to ensure 'url' is always a string ---
    const certsMapped: SearchItem[] = certifications.map(cert => ({
      id: cert.id,
      type: "certification" as const,
      title: cert.title,
      description: cert.description,
      category: cert.category,
      tags: cert.skills || [], // Certs might not have skills, ensure tags is an array
      url: cert.verifyUrl ?? "", // Ensure string, even if undefined
      date: `${cert.date}-01-01`, // Assuming date is just the year/month, adding day for valid date string
    }))

    return [...skillsMapped, ...projectsMapped, ...blogsMapped, ...certsMapped]
  }, [])

  // Fetch GitHub repos dynamically - Using a custom user for the example
  useEffect(() => {
    const fetchGithubData = async () => {
      setIsSearching(true)
      try {
        const response = await fetch('https://api.github.com/users/PrathameshPawar119/repos?per_page=100')
        
        if (!response.ok) {
            console.warn('Could not fetch GitHub repos. Using local data only.')
            return 
        }
        
        const repos = await response.json()
        const mappedRepos: SearchItem[] = repos
          .filter((repo: any) => !repo.fork && repo.description) // Filter real projects
          .map((repo: any) => ({
            id: repo.name,
            type: "project" as const,
            title: repo.name.replace(/-/g, ' ').replace(/\b\w/g, (char: string) => char.toUpperCase()),
            description: repo.description || "Data science/ML project",
            category: "GitHub Project",
            tags: [repo.language || "Python", "Data Science", ...(repo.topics || [])].filter(Boolean), // Ensure tags are cleaned
            url: repo.html_url,
            date: repo.updated_at.split('T')[0],
            stars: repo.stargazers_count,
            language: repo.language,
          }))
          .sort((a: SearchItem, b: SearchItem) => new Date(b.date).getTime() - new Date(a.date).getTime())

        setGithubRepos(mappedRepos)
      } catch (error) {
        console.error('Failed to fetch GitHub data:', error)
      } finally {
        setIsSearching(false)
      }
    }

    fetchGithubData()
  }, [])

  // Combine data sources
  const allData = useMemo(() => [...githubRepos, ...localData], [githubRepos, localData])

  // Dynamic filters
  const filters = useMemo(() => {
    const types = [...new Set(allData.map(item => item.type))]
    return [
      { id: "all", name: "All Results", count: allData.length },
      ...types.map(type => ({
        id: type,
        name: `${type.charAt(0).toUpperCase() + type.slice(1)}s`,
        count: allData.filter(item => item.type === type).length
      }))
    ]
  }, [allData])

  // Perform search (Debounced logic)
  useEffect(() => {
    const performSearch = () => {
      let filtered = allData

      // Filter by type
      if (selectedFilter !== "all") {
        filtered = filtered.filter((item) => item.type === selectedFilter)
      }

      // Filter by search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        filtered = filtered.filter(
          (item) =>
            item.title.toLowerCase().includes(query) ||
            item.description.toLowerCase().includes(query) ||
            item.tags.some((tag) => tag.toLowerCase().includes(query)) ||
            item.category.toLowerCase().includes(query),
        )
      }

      // Sort by date descending
      filtered = filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

      setSearchResults(filtered)
    }

    // A debounce can be implemented here if performance suffers on large datasets
    // For now, running immediately as data size is manageable.
    performSearch()
  }, [searchQuery, selectedFilter, allData])

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "project": return "🚀"
      case "dashboard": return "📊"
      case "blog": return "📝"
      case "skill": return "🛠️"
      case "certification": return "🏆"
      default: return "📄"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "project": return "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200"
      case "dashboard": return "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200"
      case "blog": return "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200"
      case "skill": return "bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-200"
      case "certification": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200"
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-200"
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-8">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
        <Input
          type="text"
          placeholder="Search projects, blog posts, skills, and more... (fetched from GitHub & static sources)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12 h-14 text-lg rounded-xl focus:ring-2 focus:ring-primary focus:ring-offset-2"
          aria-label="Global search input"
        />
      </div>

      {/* Filters - DYNAMIC */}
      <Card className="rounded-xl shadow-lg border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center mb-4">
            <Filter className="w-5 h-5 text-primary mr-2" />
            <h3 className="font-semibold text-lg">Filter Results</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <Badge
                key={filter.id}
                variant={selectedFilter === filter.id ? "default" : "outline"}
                className={`cursor-pointer hover:bg-primary/80 hover:text-primary-foreground transition-all duration-200 px-3 py-1 text-sm ${
                    selectedFilter === filter.id ? "bg-primary text-primary-foreground" : "border-primary/50 text-foreground/80 hover:bg-primary/10"
                }`}
                onClick={() => setSelectedFilter(filter.id)}
              >
                {filter.name} ({filter.count})
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            {isSearching ? "Fetching latest data..." : `${searchResults.length} Results`}
            {searchQuery && searchResults.length > 0 && ` for "${searchQuery}"`}
          </h2>
          {githubRepos.length > 0 && (
            <Badge variant="secondary" className="text-sm border-green-500/50 text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-300">
              {githubRepos.length} GitHub Projects Loaded
            </Badge>
          )}
        </div>

        {searchResults.length === 0 && !isSearching ? (
          <Card className="rounded-xl shadow-lg">
            <CardContent className="p-12 text-center">
              <div className="text-6xl mb-4 text-primary animate-pulse">🔍</div>
              <h3 className="text-xl font-semibold mb-2">No results found</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Try adjusting your search terms or filters. Data is fetched live from GitHub and static sources.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {searchResults.map((result) => (
              <Card key={result.id} className="hover:shadow-lg transition-all duration-300 rounded-xl overflow-hidden hover-lift border-primary/20">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{getTypeIcon(result.type)}</span>
                      <Badge className={`text-xs font-medium ${getTypeColor(result.type)}`}>
                        {result.type.charAt(0).toUpperCase() + result.type.slice(1)}
                      </Badge>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground space-x-4">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(result.date).toLocaleDateString()}
                      </div>
                      {result.stars !== undefined && (
                        <div className="flex items-center text-yellow-500">
                          ⭐ {result.stars}
                        </div>
                      )}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold hover:text-primary transition-colors duration-200">
                    {/* Use Link component with target blank for external URLs */}
                    {result.url.startsWith('/') ? (
                        <Link href={result.url}>{result.title}</Link>
                    ) : (
                        <a href={result.url} target="_blank" rel="noopener noreferrer">{result.title}</a>
                    )}
                  </h3>

                  <p className="text-muted-foreground text-sm line-clamp-3">{result.description}</p>

                  <div className="flex flex-wrap gap-2">
                    {result.tags.slice(0, 4).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {result.tags.length > 4 && (
                      <Badge variant="secondary" className="text-xs">
                        +{result.tags.length - 4}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    {result.language && (
                      <Badge variant="outline" className="text-xs">
                        {result.language}
                      </Badge>
                    )}
                    <Button variant="outline" size="sm" asChild className="group">
                        {/* Use Link component with target blank for external URLs */}
                        {result.url.startsWith('/') ? (
                            <Link href={result.url}>
                                View
                                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                            </Link>
                        ) : (
                            <a href={result.url} target="_blank" rel="noopener noreferrer">
                                View
                                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                            </a>
                        )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}