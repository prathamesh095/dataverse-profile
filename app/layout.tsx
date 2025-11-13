import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { Suspense, memo } from "react"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { PageLoader } from "@/components/loading-spinner"
import { cn } from "@/lib/utils"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

/* -------------------------------- */
/*             METADATA             */
/* -------------------------------- */
export const metadata: Metadata = {
  title: {
    default: "Prathamesh Sanjay Pawar | Data Analyst & Data Scientist",
    template: "%s | Prathamesh Portfolio",
  },
  description:
    "Portfolio of Prathamesh Sanjay Pawar - Data Analyst & Data Scientist specializing in machine learning, visualization, and business intelligence.",
  keywords: [
    "Data Analyst",
    "Data Scientist",
    "Machine Learning",
    "Python",
    "SQL",
    "Tableau",
    "Power BI"
  ],
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
        alt: "Prathamesh Pawar Portfolio",
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

/* -------------------------------- */
/*             VIEWPORT             */
/* -------------------------------- */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0b0b" },
  ],
}

/* -------------------------------- */
/*        GRID + BLOB BACKGROUND    */
/* -------------------------------- */
const GridBackground = memo(function GridBackground({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-grid-base">
      <div className="blob blob-a" />
      <div className="blob blob-b" />
      <div className="blob blob-c" />

      <div className="relative z-10 w-full">{children}</div>
    </div>
  )
})

/* -------------------------------- */
/*              SPOTLIGHT           */
/* -------------------------------- */
const Spotlight = memo(function Spotlight({
  className,
  fill = "white",
}: {
  className?: string
  fill?: string
}) {
  return (
    <svg
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 z-0 w-full h-full blur-[100px] will-change-transform",
        className
      )}
      viewBox="0 0 960 540"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g opacity="0.45">
        <circle cx="240" cy="120" r="200" fill={fill} />
        <circle cx="720" cy="420" r="200" fill={fill} />
      </g>
    </svg>
  )
})

/* -------------------------------- */
/*             ROOT LAYOUT          */
/* -------------------------------- */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="dns-prefetch" href="//github.com" />
        <link rel="dns-prefetch" href="//linkedin.com" />
        <link rel="dns-prefetch" href="//x.com" />
        <link rel="dns-prefetch" href="//vercel.com" />
      </head>

      <body className={cn("font-sans antialiased overflow-x-hidden", inter.variable)}>
        <GridBackground>
          <Spotlight />

          <Suspense fallback={<PageLoader />}>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
            >
              {children}
            </ThemeProvider>
          </Suspense>

          <Analytics />
        </GridBackground>
      </body>
    </html>
  )
}
