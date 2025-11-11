// /lib/blogs.ts

export type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  publishDate: string;
  featured?: boolean;
  content?: string;
  link?: string;
};

export const blogPosts: BlogPost[] = [
  {
    id: "aws-modern-data-platform",
    title: "Build your data pipeline in your AWS modern data platform using AWS Lake Formation, AWS Glue, and dbt Core",
    excerpt:
      "Learn how to deploy a cost-effective and scalable data pipeline in your modern data platform using the dbt-glue adapter on AWS, integrating Lake Formation and Glue.",
    category: "data-engineering",
    tags: ["AWS", "dbt", "Data Pipeline", "Glue"],
    publishDate: "2022-04-21",
    featured: true,
    link: "https://aws.amazon.com/blogs/big-data/build-your-data-pipeline-in-your-aws-modern-data-platform-using-aws-lake-formation-aws-glue-and-dbt-core/",
  },
  {
    id: "dataversity-role-of-data-engineering",
    title: "How AI is rebuilding the future of Civil Engineering",
    excerpt:
      "Experts believe the future belongs to engineers who can blend core civil fundamentals with the language of data, turning AI from a buzzword into a blueprint for smarter, safer, and more sustainable infrastructure.",
    category: "machine-learning",
    tags: ["Data Engineering", "AI", "Machine Learning", "Infrastructure"],
    publishDate: "2025-11-06",
    link: "https://www.indiatoday.in/education-today/jobs-and-careers/story/ai-civil-engineering-predictive-models-smart-infrastructure-india-scaling-pilots-2814647-2025-11-06",
  },
  {
    id: "aws-zero-etl-lakehouse",
    title: "Amazon DynamoDB zero-ETL integration with Amazon SageMaker Lakehouse – Part 1",
    excerpt:
      "Discover how to run analytics workloads on your DynamoDB data without setting up and managing complex ETL pipelines, consolidating data for holistic analytics in SageMaker Lakehouse.",
    category: "data-analytics",
    tags: ["AWS", "ETL", "SageMaker", "Zero-ETL"],
    publishDate: "2025-06-10",
    link: "https://aws.amazon.com/blogs/database/amazon-dynamodb-zero-etl-integration-with-amazon-sagemaker-lakehouse-part-1/",
  },
  {
    id: "google-data-governance",
    title: "ETLC - A Context-First Approach to Data Processing in the Generative AI Era",
    excerpt:
      "Introducing ETLC (Extract, Transform, Load, Contextualize), which adds semantic, relational, and operational context to data pipelines, enabling dynamic context engines for Generative AI and RAG systems.",
    category: "data-analytics",
    tags: ["Google Cloud", "Data Governance", "Generative AI"],
    publishDate: "2025-04-25",
    link: "https://cloud.google.com/blog/topics/inside-google-cloud/whats-new-google-cloud",
  },
  {
    id: "deloitte-ai-ethics",
    title: "Internal Audit's role in strengthening AI governance",
    excerpt:
      "Deloitte explores how internal audit teams can provide assurance that AI governance, risk management, and controls are well-designed and functioning effectively—moving from principles to practical assurance.",
    category: "machine-learning",
    tags: ["AI Ethics", "Governance", "Responsible AI", "Audit"],
    publishDate: "2025-11-07",
    link: "https://www.deloitte.com/us/en/services/audit-assurance/blogs/accounting-finance/audit-ai-risk-management.html",
  },
  {
    id: "microsoft-data-fabric",
    title: "Microsoft named a Leader in The Forrester Wave™: Data Fabric Platforms, Q4 2025",
    excerpt:
      "Microsoft Fabric is named a Leader, receiving the highest scores in Current Offering and Strategy categories, reflecting its unified, intelligent, and agentic data fabric for data management, analytics, and AI.",
    category: "data-engineering",
    tags: ["Microsoft", "Azure", "Data Fabric", "Power BI"],
    publishDate: "2025-11-03",
    link: "https://blog.fabric.microsoft.com/en-us/blog/microsoft-named-a-leader-in-the-forrester-wave-data-fabric-platforms-q4-2025/",
  },
  {
    id: "tableau-data-visualization",
    title: "Data Visualization Tips and Best Practices",
    excerpt:
      "A comprehensive guide to designing effective, data-driven dashboards and visualizations by prioritizing audience, purpose, formatting, and the use of color and size.",
    category: "data-visualization",
    tags: ["Tableau", "Visualization", "Analytics", "Dashboards"],
    publishDate: "2023-11-08",
    link: "https://www.tableau.com/visualization/data-visualization-best-practices",
  },
  {
    id: "aws-ai-ml-trends",
    title: "Top Generative AI Skills and Education Trends for 2025",
    excerpt:
      "AWS experts share insights on the most impactful skills trends shaping AI and ML, focusing on the critical role of Generative AI fluency and the rise of AI-powered learning.",
    category: "machine-learning",
    tags: ["AWS", "AI", "ML Trends", "Generative AI"],
    publishDate: "2025-01-08",
    link: "https://aws.amazon.com/executive-insights/content/top-generative-ai-skills-and-education-trends-for-2025/",
  },
  {
    id: "snowflake-data-sharing",
    title: "Snowflake Data Sharing Explained for Data Engineering Projects",
    excerpt:
      "Learn how Snowflake's Secure Data Sharing feature solves the problem of data silos, enabling secure, real-time sharing of data at the metadata level without any data duplication.",
    category: "cloud",
    tags: ["Snowflake", "Data Sharing", "Cloud"],
    publishDate: "2025-09-18",
    link: "https://www.projectpro.io/article/snowflake-data-sharing/1167",
  },
  {
    id: "databricks-lakehouse",
    title: "Data Lakehouse: Transforming Analytics with Unified Data",
    excerpt:
      "The Databricks Lakehouse Platform revolutionizes data processing by integrating lakehouse architecture and machine learning for faster analytics, collaboration, and efficiency on open standards like Delta Lake.",
    category: "data-engineering",
    tags: ["Databricks", "Lakehouse", "ETL", "Delta Lake"],
    publishDate: "2025-10-13",
    link: "https://datamites.com/blog/data-lakehouse-transforming-analytics-with-unified-data/",
  },
];