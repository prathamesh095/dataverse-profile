// components/skills/SkillListRow.tsx
"use client";

import React, { memo, useMemo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { skillCategories, type SkillCategory, type Skill } from "@/lib/skills";
import { Star as StarIcon } from "lucide-react";

export type ExtendedSkill = Skill & {
  category: string;
  consistency?: number;
  usage?: "High" | "Medium" | "Low";
  confidence?: "Strong" | "Medium" | "Basic";
};

interface SkillListRowProps {
  skill: ExtendedSkill;
  getProficiencyLabel: (level: number) => string;
  showLastUsed?: boolean;
}

export const SkillListRow = memo(
  ({ skill, getProficiencyLabel, showLastUsed = true }: SkillListRowProps) => {
    const category = useMemo(
      () => skillCategories.find((cat: SkillCategory) => cat.id === skill.category),
      [skill.category]
    );

    const consistency = Math.max(0, Math.min(5, skill.consistency ?? 3));
    const level = Math.max(0, Math.min(100, skill.level ?? 0));

    return (
      <motion.div
        layout
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 40 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="h-full"
      >
        <Card className="h-full hover:shadow-xl transition-all duration-300 border border-primary/20 bg-card/80 backdrop-blur-sm">
          <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center justify-between">
              
              {/* Left: Logo + Name + Meta */}
              <div className="flex items-start gap-4 flex-1 min-w-0">
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

                <div className="min-w-0 flex-1">
                  <CardTitle className="text-lg font-bold truncate group-hover:text-primary transition-colors">
                    {skill.name}
                  </CardTitle>
                  <CardDescription className="text-xs mt-1.5 flex flex-wrap gap-x-2 text-muted-foreground">
                    <span className="text-primary font-medium">
                      {category?.title ?? skill.category}
                    </span>
                    <span>• {skill.yearsOfExperience ?? "—"}+ yrs</span>
                    {showLastUsed && skill.lastUsed && (
                      <>
                        <span>•</span>
                        <span>Last used: {skill.lastUsed}</span>
                      </>
                    )}
                  </CardDescription>
                </div>
              </div>

              {/* Right: Stats (Responsive) */}
              <div className="flex flex-wrap gap-3 sm:gap-6 items-center justify-between sm:justify-end w-full sm:w-auto">
                
                {/* Proficiency */}
                <div className="text-center min-w-20">
                  <p className="text-xs text-muted-foreground">Proficiency</p>
                  <p className="text-base font-bold mt-0.5">
                    {getProficiencyLabel(level)}
                  </p>
                  <p className="text-xs text-muted-foreground/80">({level}%)</p>
                </div>

                {/* Consistency - Hidden on mobile */}
                <div className="hidden md:flex flex-col items-center gap-1">
                  <p className="text-xs text-muted-foreground">Consistency</p>
                  <div className="flex gap-1">
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
                </div>

                {/* Usage & Confidence - Hidden on small screens */}
                <div className="hidden lg:flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Usage</p>
                    <p className="text-base font-bold mt-0.5">{skill.usage ?? "Medium"}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Confidence</p>
                    <p className="text-base font-bold mt-0.5">{skill.confidence ?? "Medium"}</p>
                  </div>
                </div>

                {/* Badge - Always visible */}
                <Badge variant="secondary" className="text-xs font-bold whitespace-nowrap">
                  {getProficiencyLabel(level)}
                </Badge>
              </div>
            </div>

            {/* Mobile-only: Extra stats below */}
            <div className="mt-4 pt-4 border-t border-border/30 flex flex-wrap gap-4 text-sm md:hidden">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Consistency:</span>
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarIcon
                      key={i}
                      className={cn(
                        "w-3.5 h-3.5",
                        i < consistency ? "text-amber-500 fill-amber-500" : "text-muted-foreground/30"
                      )}
                    />
                  ))}
                </div>
              </div>
              <div className="flex gap-4">
                <span>
                  <span className="text-muted-foreground">Usage:</span>{" "}
                  <span className="font-medium">{skill.usage ?? "Medium"}</span>
                </span>
                <span>
                  <span className="text-muted-foreground">Confidence:</span>{" "}
                  <span className="font-medium">{skill.confidence ?? "Medium"}</span>
                </span>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  }
);

SkillListRow.displayName = "SkillListRow";