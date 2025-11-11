"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Building, TrendingUp } from "lucide-react"

const timelineEvents = [
  {
    id: "freelancing-2025",
    type: "work",
    title: "Freelance Data Analyst & Data Scientist",
    organization: "Independent / Clients Worldwide",
    location: "Remote",
    period: "2025 - Present",
    description:
      "Providing end-to-end data analytics, visualization, and machine learning solutions to diverse clients, helping businesses make data-driven decisions.",
    achievements: [
      "Delivered 10+ end-to-end analytics projects across industries",
      "Built predictive and recommendation models increasing client KPIs by 20-30%",
      "Designed dashboards and automated reporting pipelines for multiple clients",
    ],
    technologies: ["Python", "R", "SQL", "Tableau", "Power BI", "AWS", "Docker"],
    current: true,
  },
]

export function TimelineSection() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Professional Journey</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Highlighting my freelancing experience as a data professional starting 2025.
        </p>
      </div>

      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-border md:transform md:-translate-x-0.5" />

        <div className="space-y-8">
          {timelineEvents.map((event, index) => {
            const isLeft = true // single event, keep left
            const Icon = Building

            return (
              <div
                key={event.id}
                className={`relative flex items-center md:flex-row`}
              >
                {/* Timeline Dot */}
                <div
                  className={`absolute left-4 md:left-1/2 w-3 h-3 rounded-full border-2 border-background z-10 md:transform md:-translate-x-1.5 ${
                    event.current ? "bg-primary border-primary" : "bg-muted border-border"
                  }`}
                />

                {/* Content Card */}
                <div className={`ml-12 md:ml-0 md:w-1/2 md:pr-8`}>
                  <Card className={`hover:shadow-lg transition-all duration-300 border-primary/50 bg-primary/5`}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-lg flex items-center justify-center mr-3 bg-blue-100 text-blue-600">
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <Badge variant="default" className="text-xs mb-1">
                              Experience
                            </Badge>
                          </div>
                        </div>
                        {event.current && <Badge className="bg-primary text-primary-foreground">Current</Badge>}
                      </div>

                      <h3 className="font-bold text-lg mb-1">{event.title}</h3>
                      <p className="font-medium text-primary mb-2">{event.organization}</p>

                      <div className="flex items-center text-sm text-muted-foreground mb-3 space-x-4">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>{event.period}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span>{event.location}</span>
                        </div>
                      </div>

                      <p className="text-muted-foreground mb-4">{event.description}</p>

                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-sm mb-2">Key Achievements</h4>
                          <ul className="space-y-1">
                            {event.achievements.map((achievement, i) => (
                              <li key={i} className="text-sm text-muted-foreground flex items-start">
                                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 mr-2 shrink-0" />
                                {achievement}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-semibold text-sm mb-2">Technologies Used</h4>
                          <div className="flex flex-wrap gap-1">
                            {event.technologies.map((tech) => (
                              <Badge key={tech} variant="secondary" className="text-xs">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
