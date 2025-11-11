import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { PageLoader } from "@/components/loading-spinner"
import { Suspense } from "react"
import { cn } from "@/lib/utils"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata: Metadata = {
  title: {
    default: "Prathamesh Sanjay Pawar | Data Analyst & Data Scientist",
    template: "%s | Prathamesh Portfolio",
  },
  description:
    "Portfolio of Prathamesh Sanjay Pawar - Data Analyst & Data Scientist specializing in machine learning, data visualization, and business intelligence.",
  keywords: ["Data Analyst", "Data Scientist", "Machine Learning", "Python", "SQL", "Tableau", "Power BI"],
  authors: [{ name: "Prathamesh Sanjay Pawar" }],
  creator: "Prathamesh Sanjay Pawar",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Prathamesh Portfolio",
    images: [
      {
        url: "https://prathamesh-portfolio.vercel.app/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Prathamesh Pawar - Data Scientist Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    creator: "@prathamesh095",
    images: ["https://prathamesh-portfolio.vercel.app/og-image.jpg"],
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0b0b" },
  ],
}

export function GridBackground({ children }: { children?: React.ReactNode }) {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden px-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
      <div
        className={cn(
          "absolute inset-0 bg-size-[50px_50px]",
          "bg-[linear-gradient(to_right,#d4d4d8_0.5px,transparent_0.7px),linear-gradient(to_bottom,#d4d4d8_0.5px,transparent_0.5px)]",
          "dark:bg-[linear-gradient(to_right,#2c2c2c_0.5px,transparent_0.5px),linear-gradient(to_bottom,#2c2c2c_0.5px,transparent_0.5px)]"
        )}
      />
      <div className="absolute top-1/4 left-1/4 w-48 h-48 sm:w-72 sm:h-72 md:w-96 md:h-96 bg-primary/20 rounded-full blur-3xl motion-safe:animate-pulse motion-reduce:animate-none" />
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 sm:w-72 sm:h-72 md:w-96 md:h-96 bg-secondary/20 rounded-full blur-3xl motion-safe:animate-pulse motion-reduce:animate-none" style={{ animationDelay: "1s" }} />
      <div className="absolute top-1/2 right-1/3 w-40 h-40 sm:w-60 sm:h-60 md:w-72 md:h-72 bg-accent/20 rounded-full blur-3xl motion-safe:animate-pulse motion-reduce:animate-none" style={{ animationDelay: "2s" }} />
      <div className="relative z-10 w-full">{children}</div>
    </div>
  )
}

export function Spotlight({ className, fill = "white" }: { className?: string; fill?: string }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className={cn("pointer-events-none absolute inset-0 z-1 h-full w-full blur-3xl motion-safe:animate-pulse motion-reduce:animate-none", className)}
      width="100%"
      height="100%"
      viewBox="0 0 960 540"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter)">
        <circle cx="200" cy="100" r="200" fill={fill} fillOpacity="0.5" />
        <circle cx="760" cy="440" r="200" fill={fill} fillOpacity="0.5" />
      </g>
      <defs>
        <filter id="filter" x="-40%" y="-40%" width="180%" height="180%" filterUnits="objectBoundingBox">
          <feGaussianBlur in="SourceGraphic" stdDeviation="151.604" />
        </filter>
      </defs>
    </svg>
  )
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <link rel="dns-prefetch" href="//github.com" />
        <link rel="dns-prefetch" href="//linkedin.com" />
        <link rel="dns-prefetch" href="//x.com" />
        <link rel="dns-prefetch" href="//vercel.com" />
      </head>
      <body className={`font-sans ${inter.variable} antialiased min-h-screen overflow-x-hidden`}>
        <GridBackground>
          <Spotlight />
          <Suspense fallback={<PageLoader />}>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange={false}>
              {children}
            </ThemeProvider>
          </Suspense>
          <Analytics />
        </GridBackground>
      </body>
    </html>
  )
}
