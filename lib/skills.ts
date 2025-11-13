// /lib/skills.ts
import { Brain, Cloud, Database, Code2, BarChart2, Layers } from "lucide-react";

export interface Skill {
  name: string;
  level: number; // 0–100 proficiency
  consistency: number; // 0–5 stars
  usage: "High" | "Medium" | "Low";
  confidence: "Strong" | "Medium" | "Basic";

  experience: string;
  category: string;
  yearsOfExperience: number;
  lastUsed: string;
  logo?: string;

  // Optional metadata fields used in search
  tags?: string[];
  description?: string;
  technologies?: string[];
}

export interface SkillCategory {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  skills: Skill[];
}

const _skillCategories: SkillCategory[] = [
  // ---------------------------------------
  // PROGRAMMING
  // ---------------------------------------
  {
    id: "programming",
    title: "Programming & Scripting",
    description:
      "Core programming languages and frameworks essential for data science and analytics.",
    icon: Code2,
    color: "from-blue-500 to-indigo-500",
    skills: [
      {
        name: "Python",
        level: 95,
        consistency: 5,
        usage: "High",
        confidence: "Strong",
        experience: "2+ years",
        category: "programming",
        yearsOfExperience: 2,
        lastUsed: "Today",
        logo:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Python_logo_01.svg/640px-Python_logo_01.svg.png",
      },
      {
        name: "SQL",
        level: 93,
        consistency: 5,
        usage: "High",
        confidence: "Strong",
        experience: "1.5+ years",
        category: "programming",
        yearsOfExperience: 1.5,
        lastUsed: "1 day ago",
        logo:
          "https://upload.wikimedia.org/wikipedia/commons/8/87/Sql_data_base_with_logo.png",
      },
      {
        name: "C",
        level: 75,
        consistency: 3,
        usage: "Medium",
        confidence: "Medium",
        experience: "1+ years",
        category: "programming",
        yearsOfExperience: 1,
        lastUsed: "2 weeks ago",
        logo: "https://icon.icepanel.io/Technology/svg/C.svg",
      },
      {
        name: "C++",
        level: 75,
        consistency: 3,
        usage: "Low",
        confidence: "Medium",
        experience: "1+ years",
        category: "programming",
        yearsOfExperience: 1,
        lastUsed: "50 days ago",
        logo:
          "https://upload.wikimedia.org/wikipedia/commons/1/18/ISO_C%2B%2B_Logo.svg",
      },
    ],
  },

  // ---------------------------------------
  // DATA ENGINEERING
  // ---------------------------------------
  {
    id: "data-engineering",
    title: "Data Engineering",
    description: "Scalable data pipelines, modeling, and ETL architecture.",
    icon: Database,
    color: "from-emerald-500 to-teal-500",
    skills: [
      {
        name: "Databricks",
        level: 87,
        consistency: 4,
        usage: "High",
        confidence: "Strong",
        experience: "1+ years",
        category: "data-engineering",
        yearsOfExperience: 1,
        lastUsed: "Today",
        logo:
          "https://cdn.brandfetch.io/idSUrLOWbH/theme/dark/symbol.svg",
      },
      {
        name: "ETL Pipelines",
        level: 92,
        consistency: 5,
        usage: "High",
        confidence: "Strong",
        experience: "2+ years",
        category: "data-engineering",
        yearsOfExperience: 2,
        lastUsed: "3 days ago",
        logo:
          "https://t3.ftcdn.net/jpg/04/75/02/72/360_F_475027206_RzBc0iiF5op2WY8kStxyqjxvKzXMzUXU.jpg",
      },
      {
        name: "Data Modeling",
        level: 88,
        consistency: 4,
        usage: "Medium",
        confidence: "Strong",
        experience: "2+ years",
        category: "data-engineering",
        yearsOfExperience: 2,
        lastUsed: "2 days ago",
        logo:
          "https://c8.alamy.com/comp/2DB198Y/data-modeling-icon-simple-element-from-website-development-collection-filled-data-modeling-icon-for-templates-infographics-and-more-2DB198Y.jpg",
      },
    ],
  },

  // ---------------------------------------
  // MACHINE LEARNING
  // ---------------------------------------
  {
    id: "machine-learning",
    title: "Machine Learning & AI",
    description: "Model development, training, and deployment.",
    icon: Brain,
    color: "from-purple-500 to-pink-500",
    skills: [
      {
        name: "Scikit-Learn",
        level: 91,
        consistency: 5,
        usage: "High",
        confidence: "Strong",
        experience: "1+ years",
        category: "machine-learning",
        yearsOfExperience: 2,
        lastUsed: "1 day ago",
        logo:
          "https://upload.wikimedia.org/wikipedia/commons/0/05/Scikit_learn_logo_small.svg",
      },
      {
        name: "TensorFlow",
        level: 88,
        consistency: 4,
        usage: "Medium",
        confidence: "Strong",
        experience: "1+ years",
        category: "machine-learning",
        yearsOfExperience: 1,
        lastUsed: "Today",
        logo:
          "https://upload.wikimedia.org/wikipedia/commons/2/2d/Tensorflow_logo.svg",
      },
      {
        name: "PyTorch",
        level: 86,
        consistency: 4,
        usage: "Medium",
        confidence: "Strong",
        experience: "1+ years",
        category: "machine-learning",
        yearsOfExperience: 1,
        lastUsed: "2 days ago",
        logo: "https://icon.icepanel.io/Technology/svg/PyTorch.svg",
      },
      {
        name: "Feature Engineering",
        level: 89,
        consistency: 5,
        usage: "High",
        confidence: "Strong",
        experience: "1+ years",
        category: "machine-learning",
        yearsOfExperience: 2,
        lastUsed: "3 days ago",
        logo:
          "https://as1.ftcdn.net/v2/jpg/05/02/55/36/1000_F_502553650_ZSDXXchPI6VYthXxXbaC48cMZW9TXwpX.jpg",
      },
    ],
  },

  // ---------------------------------------
  // DATA VISUALIZATION
  // ---------------------------------------
  {
    id: "data-visualization",
    title: "Data Visualization & BI",
    description: "Exploring and storytelling with data.",
    icon: BarChart2,
    color: "from-orange-500 to-red-500",
    skills: [
      {
        name: "Tableau",
        level: 90,
        consistency: 5,
        usage: "High",
        confidence: "Strong",
        experience: "1.2+ years",
        category: "data-visualization",
        yearsOfExperience: 1,
        lastUsed: "2 days ago",
        logo:
          "https://cdn.brandfetch.io/id9sYMA_Im/theme/dark/symbol.svg",
      },
      {
        name: "Power BI",
        level: 87,
        consistency: 4,
        usage: "Medium",
        confidence: "Strong",
        experience: "1+ years",
        category: "data-visualization",
        yearsOfExperience: 1,
        lastUsed: "4 days ago",
        logo: "https://logos-world.net/wp-content/uploads/2022/02/Power-BI-Logo.png",
      },
      {
        name: "Matplotlib",
        level: 89,
        consistency: 5,
        usage: "High",
        confidence: "Strong",
        experience: "2+ years",
        category: "data-visualization",
        yearsOfExperience: 2,
        lastUsed: "Today",
        logo: "https://icon.icepanel.io/Technology/svg/Matplotlib.svg",
      },
      {
        name: "Seaborn",
        level: 86,
        consistency: 4,
        usage: "Medium",
        confidence: "Strong",
        experience: "2+ years",
        category: "data-visualization",
        yearsOfExperience: 2,
        lastUsed: "3 days ago",
        logo: "https://seaborn.pydata.org/_images/logo-tall-lightbg.svg",
      },
      {
        name: "Plotly",
        level: 84,
        consistency: 4,
        usage: "Low",
        confidence: "Medium",
        experience: "2+ years",
        category: "data-visualization",
        yearsOfExperience: 2,
        lastUsed: "1 week ago",
        logo:
          "https://cdn.brandfetch.io/idwPNp71Xw/w/400/h/400/theme/dark/icon.jpeg",
      },
    ],
  },

  // ---------------------------------------
  // CLOUD
  // ---------------------------------------
  {
    id: "cloud-platforms",
    title: "Cloud Platforms",
    description: "Cloud ecosystems for storage, analytics, and deployment.",
    icon: Cloud,
    color: "from-sky-500 to-cyan-500",
    skills: [
      {
        name: "AWS",
        level: 88,
        consistency: 5,
        usage: "High",
        confidence: "Strong",
        experience: "1+ years",
        category: "cloud-platforms",
        yearsOfExperience: 0.6,
        lastUsed: "2 days ago",
        logo:
          "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg",
      },
      {
        name: "Azure",
        level: 85,
        consistency: 4,
        usage: "Medium",
        confidence: "Strong",
        experience: "1+ years",
        category: "cloud-platforms",
        yearsOfExperience: 2,
        lastUsed: "3 days ago",
        logo: "https://icon.icepanel.io/Technology/svg/Azure.svg",
      },
    ],
  },

  // ---------------------------------------
  // DATA SCIENCE TOOLS
  // ---------------------------------------
  {
    id: "data-tools",
    title: "Data Science Tools",
    description: "Essential environments and collaborative platforms.",
    icon: Layers,
    color: "from-yellow-500 to-amber-500",
    skills: [
      {
        name: "Jupyter Notebook",
        level: 93,
        consistency: 5,
        usage: "High",
        confidence: "Strong",
        experience: "5+ years",
        category: "data-tools",
        yearsOfExperience: 3,
        lastUsed: "Today",
        logo: "https://upload.wikimedia.org/wikipedia/commons/3/38/Jupyter_logo.svg",
      },
      {
        name: "Git & GitHub",
        level: 92,
        consistency: 5,
        usage: "High",
        confidence: "Strong",
        experience: "5+ years",
        category: "data-tools",
        yearsOfExperience: 2,
        lastUsed: "Today",
        logo:
          "https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg",
      },
      {
        name: "Docker",
        level: 84,
        consistency: 3,
        usage: "Medium",
        confidence: "Medium",
        experience: "3+ years",
        category: "data-tools",
        yearsOfExperience: 0.5,
        lastUsed: "3 days ago",
        logo: "https://icon.icepanel.io/Technology/svg/Docker.svg",
      },
      {
        name: "Anaconda",
        level: 90,
        consistency: 4,
        usage: "High",
        confidence: "Strong",
        experience: "4+ years",
        category: "data-tools",
        yearsOfExperience: 3,
        lastUsed: "1 day ago",
        logo: "https://icon.icepanel.io/Technology/svg/Anaconda.svg",
      },
      {
        name: "VS Code",
        level: 91,
        consistency: 5,
        usage: "High",
        confidence: "Strong",
        experience: "4+ years",
        category: "data-tools",
        yearsOfExperience: 3,
        lastUsed: "Today",
        logo: "https://tabtabapp.net/vscode-logo.png",
      },
    ],
  },
];

// Normalize category titles
function normalizeTitle(raw: string): string {
  if (!raw) return raw;
  return raw
    .split(" ")
    .map((t) => {
      if (t === t.toUpperCase()) return t;
      return t.charAt(0).toUpperCase() + t.slice(1).toLowerCase();
    })
    .join(" ");
}

export const skillCategories: SkillCategory[] = _skillCategories.map((c) => ({
  ...c,
  title: normalizeTitle(c.title),
}));

export default skillCategories;
