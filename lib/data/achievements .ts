// /lib/data/achievements.ts

import { Trophy, Award, BookOpen, Users, LucideIcon, Zap } from "lucide-react"

// Define and EXPORT the icon map for use in the component
export const AchievementIcons: { [key: string]: LucideIcon } = {
  Hackathons: Zap, // Using Zap (lightning)
  Competitions: Trophy, // Using Trophy
  Leadership: Users, // Using Users
  Certifications: BookOpen, // Using BookOpen
}

export interface Achievement {
  id: number
  title: string
  description: string
  category: "Hackathons" | "Competitions" | "Leadership" | "Certifications"
  year: string
  tags?: string
}

export const achievements: Achievement[] = [
  {
    id: 1,
    title: "TATA Crucible Hackathon Winner",
    description: "Secured 1st place in the national TATA Crucible Hackathon for innovative data analytics solution.",
    category: "Hackathons",
    year: "2023",
    tags: "Data Analytics, Innovation"
  },
  {
    id: 2,
    title: "Smart India Hackathon",
    description: "Led team to victory in Smart India Hackathon with a predictive maintenance model.",
    category: "Hackathons",
    year: "2022",
    tags: "Machine Learning, Teamwork"
  },
  {
    id: 3,
    title: "Data Science Quiz Champion",
    description: "Won 1st place in a national data science quiz contest organized by IEEE.",
    category: "Competitions",
    year: "2021",
    tags: "Statistics, Data Science"
  },
  {
    id: 4,
    title: "Case Study Competition",
    description: "Ranked in top 5 in a business analytics case study competition by IIM Bangalore.",
    category: "Competitions",
    year: "2022",
    tags: "Business Analytics, Problem Solving"
  },
  {
    id: 5,
    title: "Data Science Club President",
    description: "Led the university's Data Science Club, organizing 10+ workshops and events.",
    category: "Leadership",
    year: "2023",
    tags: "Leadership, Event Management"
  },
  {
    id: 6,
    title: "Tech Fest Coordinator",
    description: "Coordinated annual tech fest, managing a team of 20+ volunteers.",
    category: "Leadership",
    year: "2022",
    tags: "Team Management, Organization"
  },
  {
    id: 7,
    title: "AI/ML Specialization",
    description: "Completed advanced AI/ML specialization from Stanford Online.",
    category: "Certifications",
    year: "2020",
    tags: "Deep Learning, Neural Networks"
  },
  {
    id: 8,
    title: "AWS Certified Data Analytics",
    description: "Earned AWS Certified Data Analytics Specialty certification.",
    category: "Certifications",
    year: "2021",
    tags: "Cloud Computing, Data Engineering"
  }
]