import { Brain, Cloud, Database, Code2, BarChart2, Layers } from "lucide-react"

export interface Skill {
  name: string
  level: number // 0-100
  projects: number
  experience: string
  endorsements: number
  category: string
  yearsOfExperience: number
  lastUsed: string
  logo?: string
}

export interface SkillCategory {
  id: string
  title: string
  description: string
  icon: any
  color: string
  skills: Skill[]
}

export const skillCategories: SkillCategory[] = [
  {
    id: "programming",
    title: "Programming & Scripting",
    description: "Core programming languages and frameworks for data science and analytics.",
    icon: Code2,
    color: "from-blue-500 to-indigo-500",
    skills: [
      {
        name: "Python",
        level: 95,
        projects: 42,
        experience: "2+ years",
        endorsements: 180,
        category: "programming",
        yearsOfExperience: 2,
        lastUsed: "Today",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Python_logo_01.svg/640px-Python_logo_01.svg.png" 
      },
      // {
      //   name: "R",
      //   level: 82,
      //   projects: 15,
      //   experience: "1+ years",
      //   endorsements: 96,
      //   category: "programming",
      //   yearsOfExperience: 0.6,
      //   lastUsed: "1 week ago",
      //   logo: "https://upload.wikimedia.org/wikipedia/commons/1/1b/R_logo.svg"  // widely used R logo
      // },
      {
        name: "SQL",
        level: 93,
        projects: 38,
        experience: "1.5+ years",
        endorsements: 165,
        category: "programming",
        yearsOfExperience: 1.5,
        lastUsed: "1 day ago",
        logo: "https://upload.wikimedia.org/wikipedia/commons/8/87/Sql_data_base_with_logo.png"  // generic SQL icon
      },
      {
        name: "C",
        level: 75,
        projects: 9,
        experience: "1+ years",
        endorsements: 84,
        category: "programming",
        yearsOfExperience: 1,
        lastUsed: "2 weeks ago",
        logo: "https://icon.icepanel.io/Technology/svg/C.svg"  // C language logo
      },
      {
        name: "C++",
        level: 75,
        projects: 18,
        experience: "1+ years",
        endorsements: 102,
        category: "programming",
        yearsOfExperience: 1,
        lastUsed: "50 days ago",
        logo: "https://upload.wikimedia.org/wikipedia/commons/1/18/ISO_C%2B%2B_Logo.svg"  // C++ logo
      },
    ],
  },
  {
    id: "data-engineering",
    title: "Data Engineering",
    description: "Building and managing scalable data pipelines and ETL workflows.",
    icon: Database,
    color: "from-emerald-500 to-teal-500",
    skills: [
      // {
      //   name: "Apache Spark",
      //   level: 90,
      //   projects: 25,
      //   experience: "0.6+ years",
      //   endorsements: 138,
      //   category: "data-engineering",
      //   yearsOfExperience: 0.6,
      //   lastUsed: "2 days ago",
      //   logo: "https://upload.wikimedia.org/wikipedia/commons/f/f3/Apache_Spark_logo.svg"  // Spark logo
      // },
      {
        name: "Databricks",
        level: 87,
        projects: 19,
        experience: "1+ years",
        endorsements: 121,
        category: "data-engineering",
        yearsOfExperience: 1,
        lastUsed: "Today",
        logo: "https://cdn.brandfetch.io/idSUrLOWbH/theme/dark/symbol.svg?c=1dxbfHSJFAPEGdCLU4o5B"  // as earlier
      },
      {
        name: "ETL Pipelines",
        level: 92,
        projects: 28,
        experience: "2+ years",
        endorsements: 149,
        category: "data-engineering",
        yearsOfExperience: 2,
        lastUsed: "3 days ago",
        logo: "https://t3.ftcdn.net/jpg/04/75/02/72/360_F_475027206_RzBc0iiF5op2WY8kStxyqjxvKzXMzUXU.jpg"  // generic ETL icon
      },
      {
        name: "Data Modeling",
        level: 88,
        projects: 21,
        experience: "2+ years",
        endorsements: 130,
        category: "data-engineering",
        yearsOfExperience: 2,
        lastUsed: "2 days ago",
        logo: "https://c8.alamy.com/comp/2DB198Y/data-modeling-icon-simple-element-from-website-development-collection-filled-data-modeling-icon-for-templates-infographics-and-more-2DB198Y.jpg"  // generic data-model icon
      },
    ],
  },
  {
    id: "machine-learning",
    title: "Machine Learning & AI",
    description: "Model development, training, and deployment for intelligent systems.",
    icon: Brain,
    color: "from-purple-500 to-pink-500",
    skills: [
      {
        name: "Scikit-Learn",
        level: 91,
        projects: 24,
        experience: "1+ years",
        endorsements: 140,
        category: "machine-learning",
        yearsOfExperience: 2,
        lastUsed: "1 day ago",
        logo: "https://upload.wikimedia.org/wikipedia/commons/0/05/Scikit_learn_logo_small.svg"  // scikit-learn logo
      },
      {
        name: "TensorFlow",
        level: 88,
        projects: 18,
        experience: "1+ years",
        endorsements: 122,
        category: "machine-learning",
        yearsOfExperience: 1,
        lastUsed: "Today",
        logo: "https://upload.wikimedia.org/wikipedia/commons/2/2d/Tensorflow_logo.svg"  // TensorFlow logo
      },
      {
        name: "PyTorch",
        level: 86,
        projects: 17,
        experience: "1+ years",
        endorsements: 115,
        category: "machine-learning",
        yearsOfExperience: 1,
        lastUsed: "2 days ago",
        logo: "https://icon.icepanel.io/Technology/svg/PyTorch.svg"  // PyTorch logo
      },
      // {
      //   name: "MLflow",
      //   level: 80,
      //   projects: 10,
      //   experience: "1+ years",
      //   endorsements: 89,
      //   category: "machine-learning",
      //   yearsOfExperience: 1,
      //   lastUsed: "1 week ago",
      //   logo: "https://cdn.brandfetch.io/idS8GMP5c8/theme/dark/logo.svg?c=1dxbfHSJFAPEGdCLU4o5B"  // MLflow logo
      // },
      {
        name: "Feature Engineering",
        level: 89,
        projects: 22,
        experience: "1+ years",
        endorsements: 127,
        category: "machine-learning",
        yearsOfExperience: 2,
        lastUsed: "3 days ago",
        logo: "https://as1.ftcdn.net/v2/jpg/05/02/55/36/1000_F_502553650_ZSDXXchPI6VYthXxXbaC48cMZW9TXwpX.jpg"  // generic feature engineering icon
      },
    ],
  },
  {
    id: "data-visualization",
    title: "Data Visualization & BI",
    description: "Exploring, visualizing, and storytelling with data using modern tools.",
    icon: BarChart2,
    color: "from-orange-500 to-red-500",
    skills: [
      {
        name: "Tableau",
        level: 90,
        projects: 20,
        experience: "1.2+ years",
        endorsements: 118,
        category: "data-visualization",
        yearsOfExperience: 1,
        lastUsed: "2 days ago",
        logo: "https://cdn.brandfetch.io/id9sYMA_Im/theme/dark/symbol.svg?c=1dxbfHSJFAPEGdCLU4o5B"  // Tableau logo
      },
      {
        name: "Power BI",
        level: 87,
        projects: 17,
        experience: "1+ years",
        endorsements: 108,
        category: "data-visualization",
        yearsOfExperience: 1,
        lastUsed: "4 days ago",
        logo: "https://logos-world.net/wp-content/uploads/2022/02/Power-BI-Logo.png"  // Power BI logo
      },
      {
        name: "Matplotlib",
        level: 89,
        projects: 22,
        experience: "2+ years",
        endorsements: 122,
        category: "data-visualization",
        yearsOfExperience: 2,
        lastUsed: "Today",
        logo: "https://icon.icepanel.io/Technology/svg/Matplotlib.svg"  // Matplotlib logo :contentReference[oaicite:1]{index=1}
      },
      {
        name: "Seaborn",
        level: 86,
        projects: 19,
        experience: "2+ years",
        endorsements: 109,
        category: "data-visualization",
        yearsOfExperience: 2,
        lastUsed: "3 days ago",
        logo: "https://seaborn.pydata.org/_images/logo-tall-lightbg.svg"  // Seaborn logo
      },
      {
        name: "Plotly",
        level: 84,
        projects: 14,
        experience: "2+ years",
        endorsements: 101,
        category: "data-visualization",
        yearsOfExperience: 2,
        lastUsed: "1 week ago",
        logo: "https://cdn.brandfetch.io/idwPNp71Xw/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B"  // Plotly logo
      },
    ],
  },
  {
    id: "cloud-platforms",
    title: "Cloud Platforms",
    description: "Cloud ecosystems for data storage, analytics, and ML deployment.",
    icon: Cloud,
    color: "from-sky-500 to-cyan-500",
    skills: [
      {
        name: "AWS",
        level: 88,
        projects: 19,
        experience: "1+ years",
        endorsements: 116,
        category: "cloud-platforms",
        yearsOfExperience: 0.6,
        lastUsed: "2 days ago",
        logo: "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg"
      },
      //{
        //name: "Google Cloud Platform (GCP)",
        //level: 87,
        //projects: 17,
        //experience: "1+ years",
        //endorsements: 112,
        //category: "cloud-platforms",
        //yearsOfExperience: 3,
        //lastUsed: "1 week ago",
        //logo: "https://www.svgrepo.com/show/353805/google-cloud.svg"
      //},
      {
        name: "Azure",
        level: 85,
        projects: 15,
        experience: "1+ years",
        endorsements: 104,
        category: "cloud-platforms",
        yearsOfExperience: 2,
        lastUsed: "3 days ago",
        logo: "https://icon.icepanel.io/Technology/svg/Azure.svg"
      },
      // {
      //   name: "Snowflake",
      //   level: 83,
      //   projects: 12,
      //   experience: "2+ years",
      //   endorsements: 97,
      //   category: "cloud-platforms",
      //   yearsOfExperience: 2,
      //   lastUsed: "1 week ago",
      //   logo: "https://www.svgrepo.com/show/402713/snowflake.svg"
      // },
    ],
  },
  {
    id: "data-tools",
    title: "Data Science Tools",
    description: "Essential environments, notebooks, and collaborative platforms.",
    icon: Layers,
    color: "from-yellow-500 to-amber-500",
    skills: [
      {
        name: "Jupyter Notebook",
        level: 93,
        projects: 35,
        experience: "5+ years",
        endorsements: 160,
        category: "data-tools",
        yearsOfExperience: 3,
        lastUsed: "Today",
        logo: "https://upload.wikimedia.org/wikipedia/commons/3/38/Jupyter_logo.svg"  // Jupyter logo
      },
      {
        name: "Git & GitHub",
        level: 92,
        projects: 40,
        experience: "5+ years",
        endorsements: 155,
        category: "data-tools",
        yearsOfExperience: 2,
        lastUsed: "Today",
        logo: "https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg"  // GitHub logo
      },
      {
        name: "Docker",
        level: 84,
        projects: 14,
        experience: "3+ years",
        endorsements: 109,
        category: "data-tools",
        yearsOfExperience: 0.5,
        lastUsed: "3 days ago",
        logo: "https://icon.icepanel.io/Technology/svg/Docker.svg"  // Docker logo :contentReference[oaicite:2]{index=2}
      },
      {
        name: "Anaconda",
        level: 90,
        projects: 26,
        experience: "4+ years",
        endorsements: 125,
        category: "data-tools",
        yearsOfExperience: 3,
        lastUsed: "1 day ago",
        logo: "https://icon.icepanel.io/Technology/svg/Anaconda.svg"  // Anaconda logo
      },
      {
        name: "VS Code",
        level: 91,
        projects: 32,
        experience: "4+ years",
        endorsements: 134,
        category: "data-tools",
        yearsOfExperience: 3,
        lastUsed: "Today",
        logo: "https://tabtabapp.net/vscode-logo.png"  // VS Code logo
      },
    ],
  },
]
