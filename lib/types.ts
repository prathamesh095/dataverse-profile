// types.ts
import {
  Database,
  Code,
  Brain,
  BarChart3,
  TrendingUp,
  Zap,
  Eye,
  Target,
} from "lucide-react";

export interface ProcessStep {
  step: string;
  description: string;
  icon: "Database" | "Code" | "Brain" | "BarChart3" | "TrendingUp" | "Zap" | "Eye" | "Target";
}

export interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  fullDescription: string;
  image: string;
  category: string;
  technologies: string[];
  domain: string;
  metrics: Record<string, string>;
  features: string[];
  process: ProcessStep[];
  gallery: string[];
  links: {
    github: string;
    demo: string;
    dashboard?: string; // Optional dashboard link
    report?: string;    // Optional link to project report page
  };
  keyLearnings: string[];
  outcomes: string[];
  year: number;
  tags: string[];
  achievements: string[];

  // === NEW: For Quick Stats Bar ===
  duration?: string;     // e.g., "3 months", "6 weeks"
  teamSize?: string;     // e.g., "Solo", "2 members", "Team of 5"
}

export const projects: Project[] = [
  {
    id: "legacy-newspaper-survival",
    title: "Legacy Newspaper's Survival in a Post-COVID Digital Era",
    tagline: "Digital Transformation Strategy for Traditional Media",
    description: "Comprehensive data analytics project exploring challenges and opportunities for legacy newspapers transitioning to a digital-first model post-COVID-19...",
    fullDescription: "This in-depth analytics project simulates a newspaper company's operations across Indian cities, evaluating print decline, digital adoption, and revenue optimization...",
    image: "https://images.unsplash.com/photo-1529243856184-fd5465488984?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1492",
    category: "Analytics",
    technologies: ["Python", "Pandas", "NumPy", "Matplotlib", "Seaborn", "Plotly", "SQLAlchemy", "PyMySQL", "Scikit-learn"],
    domain: "Media",
    metrics: {
      printDecline: "15-20% YoY",
      topCirculation: "5M+ annual",
      fmcgStability: "+2% YoY",
      digitalGaps: "25+ cities",
      transitionIndex: "12% avg",
    },
    features: [
      "Print circulation trend analysis",
      "Ad revenue categorization and forecasting",
      "City digital readiness scoring",
      "Interactive Plotly dashboards",
      "YoY performance heatmaps",
    ],
    process: [
      {
        step: "Data Generation & Schema Design",
        description: "Created 500+ synthetic cities and populated MySQL star schema with fact/dimension tables.",
        icon: "Database",
      },
      {
        step: "Exploratory Data Analysis",
        description: "Performed comprehensive EDA with statistical tests and correlation analysis across datasets.",
        icon: "BarChart3",
      },
      {
        step: "Advanced Modeling",
        description: "Implemented time series decomposition, correlation matrices, and readiness scoring algorithms.",
        icon: "Brain",
      },
      {
        step: "Visualization & Insights",
        description: "Developed 20+ interactive Plotly charts and generated business recommendations.",
        icon: "TrendingUp",
      },
      {
        step: "Reporting & Recommendations",
        description: "Compiled executive summary with actionable strategies for digital transition.",
        icon: "Target",
      },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1529243856184-fd5465488984?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1492",
      "https://images.unsplash.com/photo-1584291527935-456e8e2dd734?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1325",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1711606815631-38d32cdaec3e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2070",
    ],
    links: {
      github: "https://github.com/prathamesh095/Data-Analysis/tree/main/Legacy%20Newspaper%E2%80%99s%20Survival%20in%20a%20Post-%20COVID%20Digital%20Era",
      demo: "https://legacy-newspaper-demo.vercel.app",
    report: "https://github.com/prathamesh095/Data-Analysis/blob/main/Legacy%20Newspaper%E2%80%99s%20Survival%20in%20a%20Post-%20COVID%20Digital%20Era/report.pdf",
    },
    keyLearnings: [
      "Designing scalable data schemas for simulation projects",
      "Combining statistical analysis with business strategy formulation",
      "Creating interactive visualizations for complex multi-dimensional data",
      "Translating data insights into actionable media transformation strategies",
    ],
    outcomes: [
      "Identified 25+ high-potential Tier 2 cities for digital expansion",
      "Recommended diversified ad strategies yielding 2% FMCG growth",
      "Developed transition index showing 5% YoY digital adoption improvement",
      "Created comprehensive roadmap for print-to-digital migration",
    ],
    year: 2024,
    tags: ["Media Analytics", "Digital Transformation"],
    achievements: ["20+ strategic insights generated", "Identified 25+ growth markets"],
    duration: "3 months",
    teamSize: "Solo",
  },
  {
    id: "strategic-merger-ott",
    title: "Strategic Merger in the OTT Domain: Synergizing Hotstar & JioCinema",
    tagline: "Data-Driven OTT Merger Simulation & Strategy",
    description: "Data analytics simulation of the Disney+ Hotstar and JioCinema merger, analyzing 300K+ records on subscriber cohorts...",
    fullDescription: "In the hyper-competitive Indian OTT landscape, this project unveils a cutting-edge data analytics simulation of the blockbuster merger...",
    image: "http://images.indianexpress.com/2025/02/JioHotstar.jpg?w=640",
    category: "Analytics",
    technologies: ["Python", "Pandas", "NumPy", "Plotly", "Matplotlib", "Seaborn", "Scikit-learn", "SQLAlchemy", "PyMySQL"],
    domain: "Media",
    metrics: {
      momGrowthJio: "27.12%",
      retention90Hotstar: "5.13%",
      retention90Jio: "2.14%",
      silhouetteScore: "0.42",
      tier3Growth: "19%",
    },
    features: [
      "Subscriber cohort analysis by retention periods",
      "K-means clustering for user segmentation",
      "MoM growth trend visualization",
      "Platform comparison dashboards",
      "Merger synergy simulations",
    ],
    process: [
      {
        step: "Data Acquisition & Preprocessing",
        description: "Loaded dual MySQL databases and CSV files, handled missing values, and standardized formats.",
        icon: "Database",
      },
      {
        step: "Acquisition Cohort Analysis",
        description: "Used pd.Grouper for temporal aggregation and calculated MoM growth metrics.",
        icon: "Code",
      },
      {
        step: "Retention Modeling",
        description: "Computed 30/60/90-day retention rates segmented by age and city tier.",
        icon: "BarChart3",
      },
      {
        step: "User Segmentation",
        description: "Applied K-means clustering on watch time and device data with silhouette validation.",
        icon: "Brain",
      },
      {
        step: "Visualization & Insights",
        description: "Created interactive Plotly charts and generated merger strategy recommendations.",
        icon: "TrendingUp",
      },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      "https://images.indianexpress.com/2025/02/JioHotstar.jpg?w=640",
      "https://plus.unsplash.com/premium_photo-1681487769650-a0c3fbaed85a?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1555",
      "https://learn.g2.com/hubfs/iStock-1078740886.jpg",
    ],
    links: {
      github: "https://github.com/prathamesh095/Data-Analysis/tree/main/Strategic%20Merger%20in%20the%20OTT%20Domain",
      demo: "https://ott-merger-demo.vercel.app",
    },
    keyLearnings: [
      "Advanced cohort analysis with temporal grouping",
      "K-means clustering for behavioral segmentation",
      "Dual-database integration and preprocessing pipelines",
      "Strategic simulation modeling for business mergers",
    ],
    outcomes: [
      "Simulated 18-25% retention uplift through cross-platform bundling",
      "Identified Tier 3 market opportunities with 19% growth potential",
      "Created user archetypes for targeted content strategies",
      "Generated comprehensive merger roadmap with ROI projections",
    ],
    year: 2025,
    tags: ["OTT Analytics", "Merger Strategy", "User Segmentation"],
    achievements: ["Analyzed 300K+ records", "Simulated 25% retention uplift"],
    duration: "10 weeks",
    teamSize: "Solo",
  },
  {
    id: "electric-vehicle-population",
    title: "Electric Vehicle Population Data Analysis",
    tagline: "EV Adoption Trends & Infrastructure Insights",
    description: "Analysis of electric vehicle registration data to understand adoption trends, geographic distribution, vehicle types, and policy impacts...",
    fullDescription: "This project examines comprehensive EV registration data to reveal patterns in adoption across regions, vehicle models, and demographics...",
    image: "https://cdn.pixabay.com/photo/2022/01/16/23/14/car-6943451_1280.jpg",
    category: "Analytics",
    technologies: ["Python", "Pandas", "NumPy", "Matplotlib", "Seaborn", "Plotly"],
    domain: "Automotive",
    metrics: {
      bevShare: "High adoption",
      geographicCoverage: "Various counties",
      modelYearRange: "Multiple years",
      electricRange: "Varies by model",
    },
    features: [
      "Geospatial distribution mapping",
      "Model and manufacturer analysis",
      "Trend visualization over time",
      "Policy impact assessment",
    ],
    process: [
      {
        step: "Data Exploration",
        description: "Loaded and profiled EV registration dataset, handled categorical encoding.",
        icon: "Database",
      },
      {
        step: "Geospatial Analysis",
        description: "Mapped registrations by county and ZIP code using geospatial libraries.",
        icon: "BarChart3",
      },
      {
        step: "Trend Identification",
        description: "Analyzed adoption trends by model year and vehicle type.",
        icon: "TrendingUp",
      },
      {
        step: "Visualization",
        description: "Created interactive choropleth maps and time series plots.",
        icon: "Eye",
      },
    ],
    gallery: [
      "https://investingnews.com/media-library/global-ev-sales-2017-to-2024.webp?id=55426709&width=980",
      "https://th.bing.com/th/id/R.ccc9334920689b1f927de56bee61d99a?rik=HP%2bYG4CtL7hfGg&riu=http%3a%2f%2fwww.dakuaishou.com%2fen%2fwp-content%2fuploads%2f2025%2f02%2fGlobal-EV-Trends-2025.jpg&ehk=yisNR3RgOc6JKs2kXzzShMYPkzzHqaNzy2kY3kVbjKQ%3d&risl=&pid=ImgRaw&r=0",
      "https://images.unsplash.com/photo-1543286386-713bdd548da4?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1470",
      "https://cdn.pixabay.com/photo/2022/01/16/23/14/car-6943451_1280.jpg",
    ],
    links: {
      github: "https://github.com/prathamesh095/Data-Analysis/tree/main/U.S.A.%20Electric%20Vehicle%20Market%20%26%20Consumer%20Insights%20Analysis",
      demo: "",
    },
    keyLearnings: [
      "Geospatial data visualization techniques",
      "Handling large categorical datasets efficiently",
      "Trend analysis for policy impact assessment",
      "Creating interactive maps for stakeholder presentations",
    ],
    outcomes: [
      "Mapped high-adoption regions for infrastructure prioritization",
      "Identified top-performing EV models by category",
      "Supported environmental policy recommendations",
      "Enhanced market research for automotive stakeholders",
    ],
    year: 2024,
    tags: ["Geospatial", "Sustainability"],
    achievements: ["Mapped county-level adoption", "Analyzed 100K+ registrations"],
    duration: "2 months",
    teamSize: "Solo",
  },
  {
    id: "olympics-data-analysis-powerbi",
    title: "Olympics Data Analysis using Power BI",
    tagline: "Interactive Olympic Performance Dashboard",
    description: "Interactive Power BI dashboard analyzing historical Olympic Games data from 1896 to 2024...",
    fullDescription: "This dynamic Power BI dashboard transforms 130+ years of Olympic data into interactive visualizations...",
    image: "https://a.espncdn.com/combiner/i?img=%2Fphoto%2F2015%2F0522%2Foly_g_rings01jr_B_1296x729.jpg",
    category: "Analytics",
    technologies: ["Power BI", "DAX", "Power Query", "Tableau"],
    domain: "Sports",
    metrics: {
      totalGames: "50+",
      totalMedals: "100,000+",
      participatingCountries: "200+",
      totalEvents: "3,000+",
    },
    features: [
      "Interactive medal count visualizations",
      "Athlete performance slicers",
      "Country ranking comparisons",
      "Event trend analysis",
      "Summer vs Winter Olympics filters",
    ],
    process: [
      {
        step: "Data Import & Transformation",
        description: "Loaded historical data and cleaned using Power Query for consistency.",
        icon: "Database",
      },
      {
        step: "DAX Modeling",
        description: "Created calculated measures for rankings, totals, and growth metrics.",
        icon: "Code",
      },
      {
        step: "Dashboard Design",
        description: "Built interactive pages with drill-through capabilities.",
        icon: "BarChart3",
      },
      {
        step: "Visualization Optimization",
        description: "Implemented slicers, bookmarks, and responsive design elements.",
        icon: "Eye",
      },
    ],
    gallery: [
      "https://www.scisports.com/wp-content/uploads/2020/08/Performance-Analysis-visual-b-render-e1601569724213-1280x817.png",
      "https://u77w41.github.io/p/paris-summer-olympic-games-2024-dashboard/ParisSummerOlympicsDashboard.jpg",
      "https://www.quantizeanalytics.co.uk/wp-content/uploads/2024/08/1-1536x851.png",
      "https://brilliantmaps.com/wp-content/uploads/summer-olympic-medals-1536x1410.jpeg",
    ],
    links: {
      github: "https://github.com/prathamesh095/-PowerBI-Projects/tree/main/Olympics",
      demo: "https://olympics-powerbi-demo.powerbi.com",
      dashboard: "",
    },
    keyLearnings: [
      "Advanced DAX formula creation for complex calculations",
      "Dashboard design principles for sports analytics",
      "Data modeling for temporal and categorical analysis",
      "Creating engaging interactive reports",
    ],
    outcomes: [
      "Visualized 130+ years of Olympic history",
      "Enabled comparative analysis across 200+ countries",
      "Supported educational and research applications",
      "Created shareable interactive dashboard",
    ],
    year: 2024,
    tags: ["Sports Analytics", "Interactive Dashboards"],
    achievements: ["Analyzed 50+ Olympic games", "Visualized 100K+ medals"],
    duration: "1 month",
    teamSize: "Solo",
  },
  {
    id: "adidas-sales-analysis-powerbi",
    title: "Adidas US Sales Analysis using Power BI",
    tagline: "Comprehensive Retail Sales Performance Dashboard",
    description: "Interactive Power BI dashboard analyzing Adidas US sales dataset from 2019-2022...",
    fullDescription: "This Power BI solution provides deep insights into Adidas US retail operations...",
    image: "https://wallsdesk.com/wp-content/uploads/2016/08/Adidas-HD-Desktop.jpg",
    category: "Analytics",
    technologies: ["Power BI", "DAX", "Power Query"],
    domain: "Retail",
    metrics: {
      totalSales: "$899M",
      topRegion: "West (27%)",
      topMethod: "Online (51%)",
      avgMargin: "42.3%",
      records: "9648",
    },
    features: [
      "Regional sales performance tracking",
      "Product category analysis",
      "Sales method comparison",
      "Profit margin monitoring",
      "Trend forecasting elements",
    ],
    process: [
      {
        step: "Data Preparation",
        description: "Imported and transformed sales data with Power Query for analysis readiness.",
        icon: "Database",
      },
      {
        step: "Metric Calculation",
        description: "Developed DAX measures for KPIs like total sales, margins, and growth rates.",
        icon: "BarChart3",
      },
      {
        step: "Dashboard Development",
        description: "Designed multi-page dashboard with drill-down capabilities.",
        icon: "Code",
      },
      {
        step: "Visualization Enhancement",
        description: "Added interactive filters and conditional formatting for insights.",
        icon: "Eye",
      },
    ],
    gallery: [
      "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhnxb96_oy_6l6sGVPDJAhksHcoEbKVlibn0UYvCfgktlH-yY6DlxCa-pnsc636N_-z8abDLBT4stdv8XljabmKsUZjO3LDwLD4yXhVPlbUGt1hpAW7qV9GLhfAStEDaRuA9D3QMSbh-Tf4A3Ipu7oM1VveZ0MAZn9bjZZ289Skinh_LOUzfRL4Pp1Eo_o/s16000/Power%20BI%20Sales%20KPI%20Dashboard%20Project%20%E2%80%93%20Using%20Microsoft%20Sample%20Data%20Set.webp",
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1758518729829-162d6bf27b5e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1931",
      "https://png.pngtree.com/thumb_back/fw800/background/20220813/pngtree-colorful-background-displays-business-dice-reflecting-profit-and-loss-photo-image_28115338.jpg",
    ],
    links: {
      github: "https://github.com/prathamesh095/-PowerBI-Projects/tree/main/Adidas%20Sales",
      demo: "https://adidas-sales-powerbi-demo.powerbi.com",
      dashboard: "",
    },
    keyLearnings: [
      "Retail KPI calculation using DAX",
      "Multi-dimensional sales analysis",
      "Dashboard design for business intelligence",
      "Data storytelling through visualizations",
    ],
    outcomes: [
      "Tracked $899M in sales across 9648 records",
      "Identified West region as top performer (27%)",
      "Optimized online sales strategy (51% share)",
      "Supported data-driven retail decisions",
    ],
    year: 2024,
    tags: ["Retail Analytics", "Business Intelligence"],
    achievements: ["Analyzed $899M sales", "Created multi-page dashboard"],
    duration: "6 weeks",
    teamSize: "Solo",
  },
  {
    id: "ipl-data-analysis",
    title: "IPL Data Analysis",
    tagline: "Comprehensive Cricket League Performance Insights",
    description: "Comprehensive exploratory data analysis of IPL matches and ball-by-ball data from 2008-2020...",
    fullDescription: "This extensive IPL analysis covers 13 seasons of data, examining match dynamics, player contributions...",
    image: "https://exchange4media.gumlet.io/news-photo/139188-IPL.jpg",
    category: "Analytics",
    technologies: ["Python", "Pandas", "NumPy", "Plotly", "Seaborn"],
    domain: "Sports",
    metrics: {
      totalMatches: "816",
      totalDeliveries: "193468",
      totalWickets: "9495",
      yearsCovered: "2008-2020",
    },
    features: [
      "Match outcome prediction factors",
      "Player performance rankings",
      "Team strategy effectiveness",
      "Run rate and pressure analysis",
      "Venue and toss impact studies",
    ],
    process: [
      {
        step: "Data Loading & Merging",
        description: "Combined matches and ball-by-ball datasets for comprehensive analysis.",
        icon: "Database",
      },
      {
        step: "Exploratory Analysis",
        description: "Profiled datasets and identified key patterns in team and player performance.",
        icon: "BarChart3",
      },
      {
        step: "Statistical Modeling",
        description: "Calculated advanced metrics like run rates, strike rates, and economy rates.",
        icon: "Brain",
      },
      {
        step: "Visualization Creation",
        description: "Developed interactive charts showing trends and comparisons.",
        icon: "TrendingUp",
      },
      {
        step: "Insights Generation",
        description: "Derived strategic recommendations based on data patterns.",
        icon: "Target",
      },
    ],
    gallery: [
      "https://hunarho.com/wp-content/uploads/2024/06/Cricanalysis1-1024x585.webp",
      "https://files.prokerala.com/news/photos/imgs/1024/match-commissioner-flipping-the-toss-coin-during-1070055.jpg",
      "https://img.jagranjosh.com/images/2023/April/1942023/ipl-most-sixes.jpg",
      "https://img.jagranjosh.com/images/2021/September/2992021/IPL-highest-wicket-taker-list.webp",
    ],
    links: {
      github: "https://github.com/prathamesh095/Data-Analysis/tree/main/IPL%20data%20analysis",
      demo: "",
    
    },
    keyLearnings: [
      "Handling large sports datasets with temporal elements",
      "Creating domain-specific performance metrics",
      "Statistical analysis of competitive sports data",
      "Visual storytelling for sports analytics",
    ],
    outcomes: [
      "Analyzed 816 matches and 193K+ deliveries",
      "Identified key success factors for IPL teams",
      "Created comprehensive player and team profiles",
      "Generated insights for fantasy cricket and betting",
    ],
    year: 2023,
    tags: ["Sports Analytics", "EDA"],
    achievements: ["Analyzed 13 IPL seasons", "Visualized 193K+ deliveries"],
    duration: "4 months",
    teamSize: "Solo",
  },
];