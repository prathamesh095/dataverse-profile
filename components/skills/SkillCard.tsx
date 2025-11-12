"use client";

import React, { memo, useMemo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { skillCategories, type SkillCategory, type Skill } from "@/lib/skills";

// Extend Skill interface to add optional certifications count
export interface ExtendedSkill extends Skill {
  certifications?: number;
}

export const SkillCard = memo(
  ({
    skill,
    getProficiencyColor,
    getProficiencyLabel,
    getCategoryColor,
  }: {
    skill: ExtendedSkill;
    getProficiencyColor: (level: number) => string;
    getProficiencyLabel: (level: number) => string;
    getCategoryColor: (categoryId: string) => string;
  }) => {
    const category = useMemo(
      () => skillCategories.find((cat: SkillCategory) => cat.id === skill.category),
      [skill.category]
    );
    const certifications = skill.certifications ?? 0;

    return (
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        whileHover={{ y: -4 }}
        className="group"
      >
        <Card className="h-full hover:shadow-xl transition-all duration-300 border border-primary/20 bg-card/60 backdrop-blur-sm hover:bg-card/90 overflow-hidden">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between gap-4">
              {skill.logo && (
                <div className="relative w-10 h-10 rounded-md overflow-hidden border border-primary/30 bg-white/40 dark:bg-card/40 flex items-center justify-center shrink-0">
                  <Image
                    src={skill.logo}
                    alt={`${skill.name} logo`}
                    fill
                    className="object-contain p-1.5 transition-transform duration-300 group-hover:scale-110"
                    sizes="40px"
                  />
                </div>
              )}

              <div className="flex-1">
                <CardTitle className="text-lg text-foreground leading-tight group-hover:text-primary transition-colors">
                  {skill.name}
                </CardTitle>
                <CardDescription className="text-xs mt-1 flex flex-wrap items-center gap-2">
                  <span>{skill.yearsOfExperience}+ years</span>
                  <span>• {skill.lastUsed}</span>
                  <span className="text-primary font-medium">
                    {category?.title || skill.category}
                  </span>
                </CardDescription>
              </div>

              <Badge
                variant="secondary"
                className={cn(
                  "text-xs font-semibold whitespace-nowrap shrink-0 border",
                  skill.level >= 90
                    ? "bg-primary/10 text-primary border-primary/30"
                    : skill.level >= 80
                    ? "bg-secondary/10 text-secondary border-secondary/30"
                    : skill.level >= 70
                    ? "bg-tertiary/10 text-tertiary border-tertiary/30"
                    : "bg-status-success/10 text-status-success border-status-success/30"
                )}
              >
                {getProficiencyLabel(skill.level)}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 pt-0">
            {/* Progress bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-muted-foreground">Proficiency</span>
                <span className="font-bold text-foreground">{skill.level}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${skill.level}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={cn(
                    "h-full bg-linear-to-r rounded-full transition-all duration-700",
                    getProficiencyColor(skill.level)
                  )}
                />
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-muted/50 rounded-lg p-3 text-center border border-primary/10 group-hover:bg-muted/70 transition">
                <p className="text-xs text-muted-foreground font-medium">Projects</p>
                <p className="text-lg font-bold text-foreground mt-1">{skill.projects}</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-3 text-center border border-primary/10 group-hover:bg-muted/70 transition">
                <p className="text-xs text-muted-foreground font-medium">Certifications</p>
                <p className="text-lg font-bold text-foreground mt-1">{certifications}</p>
              </div>
            </div>

            {/* Category */}
            <Badge
              variant="outline"
              className={cn(
                "w-full justify-center border-primary/30 text-primary",
                getCategoryColor(skill.category)
              )}
            >
              {category?.icon && <category.icon className="w-3 h-3 mr-1" aria-hidden="true" />}
              {category?.title || skill.category}
            </Badge>
          </CardContent>
        </Card>
      </motion.div>
    );
  }
);

SkillCard.displayName = "SkillCard";
