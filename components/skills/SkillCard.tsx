"use client";

import React, { memo, useMemo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Star as StarIcon } from "lucide-react";
import {
  skillCategories,
  type SkillCategory,
  type Skill,
} from "@/lib/skills";

export type ExtendedSkill = Skill & {
  category: string;
  consistency?: number;
  usage?: "High" | "Medium" | "Low";
  confidence?: "Strong" | "Medium" | "Basic";
};

interface SkillCardProps {
  skill: ExtendedSkill;
  getProficiencyColor: (level: number) => string;
  getProficiencyLabel: (level: number) => string;
  getCategoryColor: (categoryId: string) => string;
  showLastUsed?: boolean;
}

export const SkillCard = memo(
  ({
    skill,
    getProficiencyColor,
    getProficiencyLabel,
    getCategoryColor,
    showLastUsed = true,
  }: SkillCardProps) => {
    const category = useMemo(
      () =>
        skillCategories.find(
          (cat: SkillCategory) => cat.id === skill.category
        ),
      [skill.category]
    );

    const consistency = Math.max(0, Math.min(5, skill.consistency ?? 3));
    const level = Math.max(0, Math.min(100, skill.level ?? 0));

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -6, scale: 1.02 }}
        transition={{ duration: 0.32, ease: "easeOut" }}
        className="h-full"
      >
        <Card className="h-full flex flex-col border border-primary/20 bg-card/80 backdrop-blur-sm hover:bg-card/95 hover:shadow-2xl transition-all duration-300">
          {/* HEADER */}
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-3">
              {/* Logo */}
              {skill.logo && (
                <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-primary/20 bg-white/50 shrink-0">
                  <Image
                    src={skill.logo}
                    alt={skill.name}
                    fill
                    sizes="48px"
                    className="object-contain p-2"
                  />
                </div>
              )}

              {/* Title */}
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg font-bold truncate group-hover:text-primary transition-colors">
                  {skill.name}
                </CardTitle>

                <CardDescription className="text-xs mt-1 flex flex-wrap gap-x-2 text-muted-foreground">
                  <span>{skill.yearsOfExperience ?? "—"}+ yrs</span>

                  {showLastUsed && skill.lastUsed && (
                    <>
                      <span>•</span>
                      <span>Last used: {skill.lastUsed}</span>
                    </>
                  )}

                  <span>•</span>
                  <span className="text-primary font-medium">
                    {category?.title ?? skill.category}
                  </span>
                </CardDescription>
              </div>

              {/* Badge */}
              <Badge variant="secondary" className="text-xs font-bold">
                {getProficiencyLabel(level)}
              </Badge>
            </div>
          </CardHeader>

          {/* BODY */}
          <CardContent className="flex-1 flex flex-col justify-between pt-2 space-y-6">
            {/* Proficiency Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Proficiency</span>
                <span className="font-medium">{level}%</span>
              </div>

              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <motion.div
                  layout
                  className={cn(
                    "h-full bg-linear-to-r",
                    getProficiencyColor(level)
                  )}
                  initial={{ width: 0 }}
                  animate={{ width: `${level}%` }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                />
              </div>
            </div>

            {/* METRIC GRID — PERFECTLY ALIGNED (Option A) */}
            <div className="grid grid-cols-3 gap-3">
              {/* Consistency */}
              <div className="bg-muted/60 border border-primary/10 rounded-lg p-3 flex flex-col items-center justify-center h-[94px]">
                <p className="text-xs text-muted-foreground leading-none">
                  Consistency
                </p>

                <div className="flex items-center justify-center mt-2 h-5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarIcon
                      key={i}
                      className={cn(
                        "w-4 h-4",
                        i < consistency
                          ? "text-amber-500 fill-amber-500"
                          : "text-muted-foreground/30"
                      )}
                    />
                  ))}
                </div>

                <p className="text-xs font-medium mt-1 leading-none">
                  {consistency}/5
                </p>
              </div>

              {/* Usage */}
              <div className="bg-muted/60 border border-primary/10 rounded-lg p-3 flex flex-col items-center justify-center h-[94px]">
                <p className="text-xs text-muted-foreground leading-none">
                  Usage
                </p>

                <p className="text-base font-bold mt-2 leading-none">
                  {skill.usage ?? "Medium"}
                </p>
              </div>

              {/* Confidence */}
              <div className="bg-muted/60 border border-primary/10 rounded-lg p-3 flex flex-col items-center justify-center h-[94px]">
                <p className="text-xs text-muted-foreground leading-none">
                  Confidence
                </p>

                <p className="text-base font-bold mt-2 leading-none">
                  {skill.confidence ?? "Medium"}
                </p>
              </div>
            </div>

            {/* Category Badge */}
            <Badge
              variant="outline"
              className="w-full justify-center border-primary/30"
            >
              {category?.title ?? skill.category}
            </Badge>
          </CardContent>
        </Card>
      </motion.div>
    );
  }
);

SkillCard.displayName = "SkillCard";
