"use client";

import React, { memo, useMemo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { skillCategories, type SkillCategory, type Skill } from "@/lib/skills";

// Extend Skill interface for shared usage consistency
export interface ExtendedSkill extends Skill {
  certifications?: number;
}

export const SkillListRow = memo(
  ({
    skill,
    getProficiencyLabel,
  }: {
    skill: ExtendedSkill;
    getProficiencyLabel: (level: number) => string;
  }) => {
    const category = useMemo(
      () => skillCategories.find((cat: SkillCategory) => cat.id === skill.category),
      [skill.category]
    );
    const certifications = skill.certifications ?? 0;

    return (
      <motion.div
        layout
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="group"
      >
        <Card className="hover:shadow-xl transition-all duration-300 border border-primary/20 bg-card/60 backdrop-blur-sm hover:bg-card/90">
          <div className="flex gap-4 p-4 sm:p-6 items-center justify-between">
            {/* Left side: logo + name */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
              {skill.logo && (
                <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-md overflow-hidden border border-primary/30 bg-white/40 dark:bg-card/40 flex items-center justify-center shrink-0">
                  <Image
                    src={skill.logo}
                    alt={`${skill.name} logo`}
                    fill
                    className="object-contain p-1 transition-transform duration-300 group-hover:scale-110"
                    sizes="40px"
                  />
                </div>
              )}
              <div className="min-w-0">
                <CardTitle className="text-base sm:text-lg text-foreground leading-tight truncate group-hover:text-primary transition-colors">
                  {skill.name}
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm mt-0.5 flex flex-wrap items-center gap-x-2">
                  <span className="text-primary font-medium">{category?.title || skill.category}</span>
                  <span className="hidden sm:inline">•</span>
                  <span className="hidden sm:inline">{skill.yearsOfExperience}+ years</span>
                  <span className="hidden sm:inline">•</span>
                  <span className="hidden sm:inline">Last used: {skill.lastUsed}</span>
                </CardDescription>
              </div>
            </div>

            {/* Right side: metrics + badge */}
            <div className="flex items-center gap-4 sm:gap-6 shrink-0">
              <div className="text-center hidden sm:block">
                <p className="text-xs text-muted-foreground font-medium">Projects</p>
                <p className="text-base font-bold text-foreground mt-0.5">{skill.projects}</p>
              </div>
              <div className="text-center hidden sm:block">
                <p className="text-xs text-muted-foreground font-medium">Certs</p>
                <p className="text-base font-bold text-foreground mt-0.5">{certifications}</p>
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
                {getProficiencyLabel(skill.level)} ({skill.level}%)
              </Badge>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  }
);

SkillListRow.displayName = "SkillListRow";
