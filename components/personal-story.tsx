"use client"

import { useState, useMemo, memo, useCallback, type ComponentProps } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import {
  MapPin,
  Heart,
  Coffee,
  BookOpen,
  Camera,
  GraduationCap,
  Award,
  Users,
  Lightbulb,
  Trophy,
  Code,
  Briefcase,
  Calendar,
  TrendingUp,
  Download,
  Mail,
  Linkedin,
  Github,
  FileText,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import dynamic from "next/dynamic"

// Define props interface for modals
interface ModalProps {
  isOpen: boolean
  onClose: () => void
}

// Dynamic imports with named exports and proper typing (kept loading UIs)
const DynamicAchievementsPopup = dynamic<ModalProps>(
  () => import("./AchievementsPopup").then((mod) => mod.AchievementsPopup),
  {
    ssr: false,
    loading: () => (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center" />
    ),
  }
)

const DynamicCertificationsPopup = dynamic<ModalProps>(
  () => import("./CertificationsPopup").then((mod) => mod.CertificationsPopup),
  {
    ssr: false,
    loading: () => (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center" />
    ),
  }
)

const DynamicResumeModal = dynamic<ModalProps>(
  () => import("./resume-modal").then((mod) => mod.ResumeModal),
  {
    ssr: false,
    loading: () => (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center" />
    ),
  }
)

/** AnimatedButton wrapper – consistent hover/tap animation and width behavior */
type ButtonProps = ComponentProps<typeof Button>
const AnimatedButton = ({ children, className = "", ...props }: ButtonProps) => (
  <motion.div
    whileHover={{ scale: 1.04, y: -2 }}
    whileTap={{ scale: 0.98 }}
    transition={{ type: "spring", stiffness: 320, damping: 22 }}
    className="w-full sm:w-auto"
  >
    <Button
      {...props}
      className={[
        "transition-all duration-300",
        "inline-flex items-center justify-center gap-2",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className,
      ].join(" ")}
    >
      {children}
    </Button>
  </motion.div>
)

// ============================
// Memoized Sub-components
// ============================

const EducationTimelineItem = memo(
  ({
    edu,
  }: {
    edu: {
      title: string
      subtitle?: string
      institution: string
      period: string
      score: string
    }
  }) => (
    <div className="relative group/timeline">
      <div className="absolute -left-8 top-4 w-3 h-3 bg-primary rounded-full shadow-md group-hover/timeline:scale-110 transition-transform duration-300 z-10" />
      <div className="bg-card/80 backdrop-blur-sm p-4 rounded-lg hover:bg-card transition-all duration-300 hover:shadow-lg border border-border/50">
        <p className="font-semibold text-lg text-foreground">{edu.title}</p>
        {edu.subtitle && (
          <p className="text-sm text-muted-foreground">{edu.subtitle}</p>
        )}
        <p className="text-sm text-primary font-medium mt-1">
          {edu.institution}
        </p>
        <p className="text-xs text-muted-foreground mt-1 flex items-center">
          <Calendar className="w-3 h-3 mr-1" />
          {edu.period}
        </p>
        <p className="text-sm font-medium text-accent mt-1">{edu.score}</p>
      </div>
    </div>
  )
)
EducationTimelineItem.displayName = "EducationTimelineItem"

const ExtracurricularItem = memo(
  ({ activity }: { activity: { icon: any; title: string; description: string; tags?: string } }) => (
    <div className="bg-card/90 backdrop-blur-sm p-4 rounded-lg hover:bg-card transition-all duration-300 hover:shadow-lg group/activity border border-border/50">
      <div className="flex items-center mb-2">
        <activity.icon className="w-4 h-4 text-primary mr-2 group-hover/activity:text-primary transition-colors duration-300" />
        <p className="font-medium text-foreground">{activity.title}</p>
      </div>
      <p className="text-sm text-muted-foreground">{activity.description}</p>
      {activity.tags && <p className="text-xs text-accent mt-1">{activity.tags}</p>}
    </div>
  )
)
ExtracurricularItem.displayName = "ExtracurricularItem"

const TrainingItem = memo(
  ({
    training,
  }: {
    training: {
      title: string
      provider: string
      year: string
      topics: string
      certLink: string
    }
  }) => (
    <div className="bg-card/90 backdrop-blur-sm p-4 rounded-lg hover:bg-card transition-all duration-300 hover:shadow-lg border border-border/50 group/cert">
      <p className="font-medium text-foreground">{training.title}</p>
      <p className="text-sm text-muted-foreground">
        {training.provider} • {training.year}
      </p>
      <p className="text-xs text-primary mt-1">{training.topics}</p>
      <AnimatedButton
        variant="outline"
        size="sm"
        asChild
        className="mt-3 h-7 px-2 text-xs btn-outline-premium"
      >
        <a href={training.certLink} target="_blank" rel="noopener noreferrer">
          <FileText className="w-3 h-3 mr-1" />
          View Certification
        </a>
      </AnimatedButton>
    </div>
  )
)
TrainingItem.displayName = "TrainingItem"

const HobbyItem = memo(
  ({
    hobby,
  }: {
    hobby: { icon: any; title: string; description: string; link: string }
  }) => (
    <div className="text-center space-y-4 group/hobby hover:-translate-y-2 transition-transform duration-300">
      <div className="relative w-20 h-20 bg-primary/15 rounded-full flex items-center justify-center mx-auto group-hover/hobby:bg-primary/20 transition-all duration-300 shadow-lg">
        <hobby.icon className="relative w-10 h-10 text-primary transition-transform duration-300 group-hover/hobby:scale-110" />
      </div>
      <h3 className="font-semibold text-lg text-foreground">{hobby.title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{hobby.description}</p>
      <AnimatedButton
        variant="outline"
        size="sm"
        asChild
        className="h-8 px-3 text-xs btn-outline-premium"
      >
        <Link href={hobby.link}>Learn More</Link>
      </AnimatedButton>
    </div>
  )
)
HobbyItem.displayName = "HobbyItem"

const FunFactItem = memo(
  ({ fact }: { fact: { number: string; label: string } }) => (
    <div className="text-center group/stat hover:-translate-y-2 transition-transform duration-300">
      <div className="text-4xl font-bold mb-2 text-primary group-hover/stat:text-accent transition-colors duration-300">
        {fact.number}
      </div>
      <div className="text-sm text-muted-foreground leading-relaxed">
        {fact.label}
      </div>
    </div>
  )
)
FunFactItem.displayName = "FunFactItem"

// Memoized static data to prevent recreation on re-renders
const useStaticData = () =>
  useMemo(
    () => ({
      education: [
        {
          title: "Bachelor of Technology",
          subtitle: "Mechanical Engineering",
          institution: "Shivaji University, Kolhapur, Maharashtra",
          period: "Dec 2021 - Jun 2025",
          score: "CGPA: 7.69/10",
        },
        {
          title: "Higher Secondary (12th – Science)",
          subtitle: "",
          institution:
            "Karmaveer Bhaurao Patil College, Urun-Islampur, Maharashtra",
          period: "2020 - 2021",
          score: "Percentage: 86.50%",
        },
        {
          title: "Secondary (10th)",
          subtitle: "",
          institution: "New English School, Rethare Dharan",
          period: "2018 - 2019",
          score: "Percentage: 74.60%",
        },
      ],
      extracurricular: [
        {
          icon: Award,
          title: "Hackathons",
          description: "Winner at 3+ national hackathons",
          tags: "TATA Crucible, Smart India Hackathon",
        },
        {
          icon: Users,
          title: "Student Clubs",
          description: "Data Science Club President",
          tags: "Tech Fest Coordinator",
        },
        {
          icon: Code,
          title: "Competitions",
          description: "Case study competitions, Quiz contests",
          tags: "",
        },
      ],
      training: [
        {
          title: "Data Science Professional Certificate",
          provider: "Capabl India",
          year: "2025",
          topics: "ML, Data Visualization, SQL, Python , Power BI",
          certLink:
            "https://drive.google.com/file/d/1Jh7JCixX5itk2CUEz6XWz3YtcLuFCd0v/view?usp=sharing",
        },
        {
          title: "Python for Data Science",
          provider: "IBM",
          year: "2023",
          topics: "Python, Data Science, Data Analysis, Visualization",
          certLink:
            "https://www.credly.com/badges/2b0fb2e3-8c92-4c0a-bb61-c10209e2785d/public_url",
        },
        {
          title: "Data Analytics",
          provider: "Cisco Networking Academy",
          year: "2025",
          topics: "BigQuery, Data Studio",
          certLink:
            "https://www.credly.com/badges/f86b0009-4054-4ad4-94db-22db14db035d/public_url",
        },
      ],
      hobbies: [
        {
          icon: BookOpen,
          title: "Continuous Learning",
          description:
            "Always exploring new technologies, reading research papers, and taking online courses to stay at the forefront of data science innovations.",
          link: "/blog",
        },
        {
          icon: Camera,
          title: "Photography",
          description:
            "Capturing moments and stories through the lens — a habit that sharpens pattern recognition for data exploration.",
          link: "/gallery",
        },
        {
          icon: Coffee,
          title: "Coffee & Conversations",
          description:
            "Believer in the power of good coffee and meaningful discussions. Many ideas start over a simple chat.",
          link: "/contact",
        },
      ],
      funFacts: [
        { number: "500+", label: "Cups of coffee consumed while coding" },
        { number: "15+", label: "Data science books read this year" },
        { number: "3", label: "Programming languages learned recently" },
        { number: "∞", label: "Curiosity about data patterns" },
      ],
    }),
    []
  )

export function PersonalStory() {
  const [isAchievementsOpen, setIsAchievementsOpen] = useState(false)
  const [isCertificationsOpen, setIsCertificationsOpen] = useState(false)
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false)

  const staticData = useStaticData()

  // useCallback for handlers to prevent child re-renders if passed down
  const handleAchievementsOpen = useCallback(() => setIsAchievementsOpen(true), [])
  const handleCertificationsOpen = useCallback(() => setIsCertificationsOpen(true), [])
  const handleResumeOpen = useCallback(() => setIsResumeModalOpen(true), [])
  const handleCloseAchievements = useCallback(() => setIsAchievementsOpen(false), [])
  const handleCloseCertifications = useCallback(() => setIsCertificationsOpen(false), [])
  const handleCloseResume = useCallback(() => setIsResumeModalOpen(false), [])

  return (
    <div className="space-y-16 mb-16 relative">
      {/* Fixed Animated background elements - gradients removed, soft solid glows retained */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-accent/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        />
        <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-secondary/10 rounded-full blur animate-pulse" />
      </div>

      {/* HERO SECTION - Primary CTA Buttons */}
      <div className="text-center space-y-8 relative z-10">
        <div className="relative inline-block">
          <div className="absolute -inset-1 bg-primary/20 rounded-full blur opacity-75 animate-pulse"></div>
          <Image
            src="/data-scientist-headshot.png"
            alt="Prathamesh Sanjay Pawar - Data Scientist"
            width={192}
            height={192}
            className="relative w-48 h-48 rounded-full mx-auto object-cover border-4 border-background shadow-2xl"
            priority
          />
          <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground rounded-full p-3 shadow-lg animate-bounce">
            <Heart className="w-5 h-5" />
          </div>
        </div>

        <div className="space-y-6">
          <h1 className="text-5xl font-bold text-foreground">
            Prathamesh Sanjay Pawar
          </h1>
          <p className="text-2xl text-primary font-medium">
            Data Scientist & Analytics Engineer
          </p>
          <div className="flex items-center justify-center text-muted-foreground mb-6">
            <MapPin className="w-5 h-5 mr-2 text-accent" />
            <span className="text-lg">Sangli, Maharashtra, India</span>
          </div>

          {/* HERO ACTION BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto">
            <AnimatedButton
              asChild
              size="lg"
              className="group w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
            >
              <Link href="/contact" className="flex items-center gap-2 px-5 py-2.5">
                <Mail className="w-4 h-4" />
                Get In Touch
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </AnimatedButton>

            <AnimatedButton
              variant="outline"
              size="lg"
              onClick={handleResumeOpen}
              className="w-full sm:w-auto btn-outline-premium"
            >
              <Download className="w-4 h-4" />
              <span>View & Download Resume</span>
            </AnimatedButton>
          </div>
        </div>
      </div>

      {/* Animated section divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full h-px bg-primary/30"></div>
        </div>
        <div className="relative flex justify-center">
          <div className="bg-background px-4">
            <div className="w-3 h-3 bg-primary rounded-full animate-pulse shadow-lg"></div>
          </div>
        </div>
      </div>

      {/* STORY CARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
        <Card className="group border-0 bg-card backdrop-blur-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
          <CardContent className="relative p-8 z-10">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mr-4 shadow-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold">My Journey</h2>
            </div>
            <div className="space-y-4 text-muted-foreground">
              <p>
                I completed my Bachelor’s in Mechanical Engineering in 2025 at
                Shivaji University. Along the way, I discovered how data can
                turn complex systems into clear decisions—shifting my focus from
                purely mechanical problem-solving to building reliable,
                data-driven solutions.
              </p>
              <p>
                Through hackathons, internships, and hands-on analytics work, I
                learned to connect engineering discipline with modern data
                practices—statistics, machine learning, and robust engineering
                for reproducibility. What began as curiosity has become an
                end-to-end approach to delivering value with data.
              </p>
              <p>
                Today, I specialize in translating business questions into
                analytics that ship: clean data pipelines, explainable models,
                and crisp narratives that drive adoption and impact.
              </p>
            </div>
            {/* STORY CTA BUTTON */}
            <div className="pt-4">
              <AnimatedButton
                variant="outline"
                size="sm"
                asChild
                className="w-full btn-outline-premium"
              >
                <Link href="/projects" className="flex items-center justify-center gap-2 px-4 py-2">
                  View My Projects
                  <TrendingUp className="w-4 h-4" />
                </Link>
              </AnimatedButton>
            </div>
          </CardContent>
        </Card>

        <Card className="group border-0 bg-card backdrop-blur-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
          <CardContent className="relative p-8 z-10">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mr-4 shadow-lg">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold">Philosophy & Approach</h2>
            </div>
            <div className="space-y-4 text-muted-foreground">
              <p className="leading-relaxed">
                Great data work is useful, trustworthy, and adopted. I keep
                three principles front and center:
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-3 h-3 bg-primary rounded-full mt-2 mr-4 shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground mb-1">
                      Business Impact First
                    </p>
                    <p className="text-sm leading-relaxed">
                      Start with the decision, not the dataset. Every analysis
                      should map to a measurable outcome and a clear owner.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-3 h-3 bg-accent rounded-full mt-2 mr-4 shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground mb-1">
                      Engineering for Reliability
                    </p>
                    <p className="text-sm leading-relaxed">
                      Reproducible pipelines, versioned data, tests, and
                      monitoring—so insights don’t break on day two.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-3 h-3 bg-secondary rounded-full mt-2 mr-4 shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground mb-1">
                      Continuous Learning & Clarity
                    </p>
                    <p className="text-sm leading-relaxed">
                      The field moves fast. I invest in learning and communicate
                      with simple language and visuals so teams can act with
                      confidence.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* PHILOSOPHY CTA BUTTON */}
            <div className="pt-4">
              <AnimatedButton
                variant="outline"
                size="sm"
                asChild
                className="w-full btn-outline-premium"
              >
                <Link href="/about" className="flex items-center justify-center gap-2 px-4 py-2">
                  Read Full Story
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </AnimatedButton>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* EDUCATION SECTION */}
      <Card className="group border-0 bg-card backdrop-blur-lg hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
        <CardContent className="relative p-8 z-10">
          <div className="flex items-center mb-8">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mr-4 shadow-lg">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-foreground">
              Education & Learning
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Formal Education */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-primary mb-4 flex items-center">
                <GraduationCap className="w-5 h-5 mr-2" />
                Formal Education
              </h3>
              <div className="space-y-6 pl-6 border-l-2 border-primary/20 relative">
                {staticData.education.map((edu, index) => (
                  <EducationTimelineItem key={index} edu={edu} />
                ))}
              </div>
            </div>

            {/* Extracurricular Activities */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-accent mb-4 flex items-center">
                <Trophy className="w-5 h-5 mr-2" />
                Extracurricular Activities
              </h3>
              <div className="space-y-3">
                {staticData.extracurricular.map((activity, index) => (
                  <ExtracurricularItem key={index} activity={activity} />
                ))}
              </div>
              {/* EXTRACURRICULAR CTA */}
              <AnimatedButton
                variant="outline"
                size="sm"
                className="w-full mt-4 btn-outline-premium"
                onClick={handleAchievementsOpen}
              >
                View All Achievements
              </AnimatedButton>
            </div>

            {/* Workshops & Training */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-secondary mb-4 flex items-center">
                <Briefcase className="w-5 h-5 mr-2" />
                Workshops & Training
              </h3>
              <div className="space-y-3">
                {staticData.training.map((training, index) => (
                  <TrainingItem key={index} training={training} />
                ))}
              </div>
              {/* CERTIFICATIONS CTA */}
              <AnimatedButton
                variant="outline"
                size="sm"
                className="w-full mt-4 btn-outline-premium"
                onClick={handleCertificationsOpen}
              >
                View All Certifications
              </AnimatedButton>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interests & Hobbies */}
      <Card className="group border-0 bg-card backdrop-blur-sm hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
        <CardContent className="relative p-8 z-10">
          <h2 className="text-3xl font-bold mb-8 text-center text-foreground">
            Beyond Data Science
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {staticData.hobbies.map((hobby, index) => (
              <HobbyItem key={index} hobby={hobby} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Fun Facts */}
      <Card className="group border-0 bg-card backdrop-blur-sm hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
        <CardContent className="relative p-8 z-10">
          <h2 className="text-3xl font-bold mb-8 text-center text-foreground">
            Fun Facts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {staticData.funFacts.map((fact, index) => (
              <FunFactItem key={index} fact={fact} />
            ))}
          </div>

          {/* SOCIAL MEDIA BUTTONS - Added aria-labels for accessibility */}
          <div className="flex flex-wrap gap-3 justify-center mt-8">
            <AnimatedButton
              variant="outline"
              size="sm"
              asChild
              className="btn-outline-premium"
              aria-label="Connect on LinkedIn"
            >
              <a
                href="https://www.linkedin.com/in/prathamesh095"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="w-4 h-4" />
                <span>LinkedIn</span>
              </a>
            </AnimatedButton>
            <AnimatedButton
              variant="outline"
              size="sm"
              asChild
              className="btn-outline-premium"
              aria-label="View GitHub profile"
            >
              <a
                href="https://github.com/prathamesh095"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="w-4 h-4" />
                <span>GitHub</span>
              </a>
            </AnimatedButton>
            <AnimatedButton
              variant="outline"
              size="sm"
              asChild
              className="btn-outline-premium"
              aria-label="Send email"
            >
              <a href="mailto:pawar.prathamesh@outlook.com">
                <Mail className="w-4 h-4" />
                <span>Email</span>
              </a>
            </AnimatedButton>
          </div>
        </CardContent>
      </Card>

      {/* POPUPS - Dynamically loaded */}
      <DynamicAchievementsPopup
        isOpen={isAchievementsOpen}
        onClose={handleCloseAchievements}
      />

      <DynamicCertificationsPopup
        isOpen={isCertificationsOpen}
        onClose={handleCloseCertifications}
      />

      <DynamicResumeModal
        isOpen={isResumeModalOpen}
        onClose={handleCloseResume}
      />
    </div>
  )
}