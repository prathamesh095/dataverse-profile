// certifications.ts

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  date: string;
  status: string;
  credentialId?: string;
  verifyUrl?: string;
  logo?: string;
  skills: string[];
  description: string;
  category: string;
}

export const certifications: Certification[] = [
  // 🌩️ Cloud & Machine Learning
  {
    id: "aws-gen-ai",
    title: "AWS Certified Generative AI",
    issuer: "Amazon Web Services",
    date: "2024-04-07",
    status: "Active",
    credentialId: "",
    verifyUrl:
      "https://drive.google.com/file/d/17lC1yspBZUbs0tvoeOMEk_o4dlJvAzTO/view?usp=sharing",
    logo: "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg",
    skills: ["Generative AI", "AWS Services", "AI Model Deployment"],
    description:
      "Validates expertise in building and deploying generative AI solutions using AWS services.",
    category: "Cloud Platform / Machine Learning Engineering",
  },
  // {
  //   id: "gcp-data-engineer",
  //   title: "Google Cloud Professional Data Engineer",
  //   issuer: "Google Cloud",
  //   date: "2023",
  //   status: "Active",
  //   credentialId: "GCP-PDE-2023-002",
  //   verifyUrl: "https://cloud.google.com/certification/verification",
  //   logo: "https://www.svgrepo.com/show/353805/google-cloud.svg",
  //   skills: ["BigQuery", "Dataflow", "Cloud ML Engine", "Data Pipeline"],
  //   description:
  //     "Demonstrates the ability to design and build data processing systems on Google Cloud.",
  //   category: "Cloud Platform / Data Engineering",
  // },
  {
    id: "azure-ai-services",
    title: "Fundamentals of Azure AI Services",
    issuer: "Microsoft Learn",
    date: "2024-10-19",
    status: "Completed",
    verifyUrl: "https://drive.google.com/file/d/1uhVMAz566ypiN4FW_4Hr1Dz2dQErOmhi/view?usp=sharin",
    logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Microsoft_Azure.svg",
    skills: ["Azure AI", "Cognitive Services", "AI Deployment"],
    description:
      "Introduces Azure Cognitive Services and their implementation fundamentals.",
    category: "Cloud Platform / AI Services",
  },
  {
    id: "gen-ai-outskill",
    title: "Gen AI Masterclass",
    issuer: "Outskill Growth School",
    date: "2025-10",
    status: "Completed",
    verifyUrl:
      "https://drive.google.com/file/d/1LEX6mM1NAInzBlVyYXu8jIFTFXz4A4ya/view?usp=sharing",
    logo: "https://latestlogo.com/wp-content/uploads/2024/01/growthschool-logo.svg",
    skills: ["Generative AI", "AI Tools", "AI Applications"],
    description:
      "Comprehensive masterclass on generative AI technologies and practical applications.",
    category: "Artificial Intelligence / Generative AI",
  },

  // 📊 Data & Analytics
  {
    id: "tableau-certified",
    title: "Tableau Desktop Certified Professional",
    issuer: "Tableau",
    date: "2024",
    status: "Active",
    credentialId: "TAB-DCP-2022-003",
    verifyUrl: "",
    logo: "https://cdn.brandfetch.io/id9sYMA_Im/theme/dark/symbol.svg?c=1dxbfHSJFAPEGdCLU4o5B",
    skills: ["Data Visualization", "Dashboard Design", "Advanced Analytics", "Tableau Prep"],
    description:
      "Advanced certification in Tableau Desktop for complex data visualization and analytics.",
    category: "Data Visualization / Business Intelligence",
  },
  {
    id: "databricks-lakehouse",
    title: "Databricks Certified Data Engineer Professional",
    issuer: "Databricks",
    date: "2025",
    status: "Active",
    credentialId: "DB-DEP-2023-005",
    verifyUrl: "",
    logo: "https://cdn.brandfetch.io/idSUrLOWbH/theme/dark/symbol.svg?c=1dxbfHSJFAPEGdCLU4o5B",
    skills: ["Apache Spark", "Delta Lake", "Data Lakehouse", "ETL Pipelines"],
    description:
      "Certification in building and maintaining scalable data engineering solutions on Databricks.",
    category: "Data Engineering / Big Data Platforms",
  },
  // {
  //   id: "snowflake-architect",
  //   title: "SnowPro Advanced: Data Architect",
  //   issuer: "Snowflake",
  //   date: "2023",
  //   status: "Active",
  //   credentialId: "SF-ADA-2023-006",
  //   verifyUrl: "https://www.snowflake.com/certifications/verification",
  //   logo: "https://www.svgrepo.com/show/402713/snowflake.svg",
  //   skills: ["Data Architecture", "Data Modeling", "Performance Optimization", "Security"],
  //   description:
  //     "Expert-level certification for designing and implementing Snowflake data architectures.",
  //   category: "Data Architecture / Cloud Data Warehousing",
  // },
  {
    id: "data-science",
    title: "Data Science",
    issuer: "Capabl India",
    date: "2025-03-25",
    status: "Completed",
    credentialId: "CPBL25DS012",
    verifyUrl:
      "https://drive.google.com/file/d/1Jh7JCixX5itk2CUEz6XWz3YtcLuFCd0v/view?usp=sharing",
    logo: "https://s3.ap-south-1.amazonaws.com/assets.ynos.in/startup-logos/YNOS449290.jpg",
    skills: ["Data Science", "Data Analysis", "Machine Learning"],
    description:
      "Completed Data Science certification incubated by the Computer Society of India with Capabl India.",
    category: "Data Science / Analytics",
  },
  {
    id: "python-data-science-ibm",
    title: "Python for Data Science",
    issuer: "IBM",
    date: "2023-12-10",
    status: "Completed",
    credentialId: "2b0fb2e3-8c92-4c0a-bb61-c10209e2785d",
    verifyUrl:
      "https://www.credly.com/badges/2b0fb2e3-8c92-4c0a-bb61-c10209e2785d/public_url",
    logo: "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg",
    skills: ["Python", "Data Science", "Data Analysis", "Visualization"],
    description:
      "Completed IBM-accredited course on Python for data science, analytics, and visualization.",
    category: "Programming / Data Science",
  },
  {
    id: "data-analytics-cisco",
    title: "Data Analytics",
    issuer: "Cisco Networking Academy",
    date: "2025-02-04",
    status: "Completed",
    credentialId: "86b0009-4054-4ad4-94db-22db14db035d",
    verifyUrl:
      "https://www.credly.com/badges/f86b0009-4054-4ad4-94db-22db14db035d/public_url",
    logo: "https://brand-assets.security.cisco.com/cisco-light.svg",
    skills: ["Python", "Data Science", "Data Analysis", "Visualization"],
    description: "Completed Cisco-accredited certification on Data Analytics.",
    category: "Programming / Data Science",
  },
  {
    id: "sql-capabl",
    title: "SQL for Data Analytics",
    issuer: "Capabl India",
    date: "2025-04-28",
    status: "Completed",
    credentialId: "CPBLns0124SQL41",
    verifyUrl:
      "https://drive.google.com/file/d/1M4yTqkpwd22_pTy4V95ohHeVLtvapO6u/view?usp=sharing",
    logo: "https://s3.ap-south-1.amazonaws.com/assets.ynos.in/startup-logos/YNOS449290.jpg",
    skills: ["SQL", "Data Analysis", "Database Management"],
    description:
      "Completed Capabl India-accredited course on SQL for Data Analytics.",
    category: "Programming / Data Science",
  },
  {
    id: "sql-hacker-rank",
    title: "SQL for Data Analytics",
    issuer: "HackerRank",
    date: "2025-02-03",
    status: "Completed",
    credentialId: "32ad2c8d1f70",
    verifyUrl: "https://www.hackerrank.com/certificates/iframe/32ad2c8d1f70",
    logo: "https://cdn.brandfetch.io/idTrJXGwd0/theme/dark/symbol.svg?c=1dxbfHSJFAPEGdCLU4o5B",
    skills: ["SQL", "Data Analysis", "Database Management"],
    description:
      "Completed HackerRank-accredited exam on SQL for Data Analytics.",
    category: "Programming / Data Science",
  },

  // 🧠 AI & Machine Learning Specializations
  {
    id: "generative-ai-intro",
    title: "Introduction to Generative AI - Art of the Possible",
    issuer: "AWS Cloud / TCPDF",
    date: "2024-07-04",
    status: "Completed",
    verifyUrl: "",
    logo: "https://www.svgrepo.com/show/353805/google-cloud.svg",
    skills: ["Generative AI", "AI Fundamentals"],
    description:
      "Introductory course exploring generative AI concepts and applications.",
    category: "Artificial Intelligence / Generative AI",
  },
  {
    id: "fundamentals-ml",
    title: "Machine Learning Concepts",
    issuer: "Microsoft Learn",
    date: "2024-11-01",
    status: "Completed",
    verifyUrl: "https://drive.google.com/file/d/1DOuJTy3XeY6FW-FYTaNkM2Oy0wRNQ0Cd/view?usp=sharing",
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
    skills: ["Machine Learning", "Supervised Learning", "Model Evaluation"],
    description:
      "Covers ML fundamentals including supervised learning, tuning, and evaluation techniques.",
    category: "Artificial Intelligence / Machine Learning",
  },
];
