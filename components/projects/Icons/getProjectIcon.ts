// /components/projects/icons/getProjectIcon.ts
import { LucideIcon, Database, Code, Brain, BarChart3, TrendingUp, Zap, Eye, Target } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Database,
  Code,
  Brain,
  BarChart3,
  TrendingUp,
  Zap,
  Eye,
  Target,
} as const;

export const getProjectIcon = (iconName?: string): LucideIcon =>
  iconMap[iconName ?? ""] ?? BarChart3;
