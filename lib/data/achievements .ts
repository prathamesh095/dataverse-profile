// /lib/data/achievements.ts

import { Trophy, Award, BookOpen, Users, LucideIcon, Zap } from "lucide-react"

// Define and EXPORT the icon map for use in the component
export const AchievementIcons: { [key: string]: LucideIcon } = {
  Hackathons: Zap, // Represents innovation and rapid problem-solving
  Competitions: Trophy, // Represents ranking and excellence
  Leadership: Users, // Represents team leadership
  Certifications: BookOpen, // Represents learning and mastery
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
    title: "TATA Crucible Hackathon",
    description:
      "Successfully cleared the first two rounds of the TATA Crucible Hackathon, demonstrating strong analytical and problem-solving abilities.",
    category: "Hackathons",
    year: "2025",
    tags: "Data Analytics, Innovation",
  },
  {
    id: 2,
    title: "Smart India Hackathon",
    description:
      "Successfully qualified at the college level for the Smart India Hackathon, contributing to solution development on real-world problem statements.",
    category: "Hackathons",
    year: "2024",
    tags: "Machine Learning, Teamwork",
  },
  {
    id: 3,
    title: "AIR 126 in Data Science Quiz by Naukri.com",
    description:
      "Achieved an All India Rank of 126 in the Naukri.com Data Science Quiz, showcasing strong fundamentals in analytics and statistical reasoning.",
    category: "Competitions",
    year: "2025",
    tags: "Statistics, Data Science",
  },
  {
    id: 6,
    title: "Tech Fest Coordinator",
    description:
      "Coordinated the annual college tech fest, leading a team of 20+ volunteers and ensuring seamless event execution.",
    category: "Leadership",
    year: "2023",
    tags: "Team Management, Organization",
  },
  {
    id: 7,
    title: "AI/ML Specialization",
    description:
      "Completed a structured specialization program in Artificial Intelligence and Machine Learning, gaining hands-on experience in modern ML techniques.",
    category: "Certifications",
    year: "2024",
    tags: "Deep Learning, Neural Networks",
  },
]
