"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Award } from "lucide-react";
import { Project } from "@/lib/types";
import { scaleIn } from "@/lib/motion";

function AchievementsSection({ project }: { project: Project }) {
  if (!project.achievements?.length) return null;

  return (
    <Card>
      <CardContent className="p-6 sm:p-8">
        <motion.h2
          className="text-2xl sm:text-3xl font-bold mb-6 flex items-center gap-3"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <Award className="w-7 h-7 text-primary" /> Achievements
        </motion.h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {project.achievements.map((ach, i) => (
            <motion.div
              key={i}
              variants={scaleIn(i * 0.08)}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, amount: 0.25 }}
              className="flex items-center gap-3 p-4 bg-linear-to-r from-primary/5 to-accent/5 rounded-xl border border-primary/10"
            >
              <Award className="w-6 h-6 text-primary shrink-0" />
              <span className="font-medium text-foreground">{ach}</span>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default memo(AchievementsSection);
